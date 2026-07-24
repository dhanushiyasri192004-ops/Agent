import User from '../models/User.js';
import Agent from '../models/Agent.js';
import Shop from '../models/Shop.js';
import Report from '../models/Report.js';
import ActivityLog from '../models/ActivityLog.js';
import { seedData } from '../seedDB.js';

export const getDashboardMetrics = async (req, res, next) => {
  const role = req.user.role;

  try {
    let metrics = {};

    if (role === 'State Agent' || role === 'Admin') {
      const agentProfile = await Agent.findOne({ user: req.user._id });
      const stateName = agentProfile ? agentProfile.state : 'Tamil Nadu';

      const subAgents = await Agent.find({ role: { $ne: 'State Agent' } });
      const districtAgentsCount = subAgents.filter(a => a.role === 'District Agent').length;
      const divisionalAgentsCount = subAgents.filter(a => a.role === 'Divisional Agent').length;
      const pincodeAgentsCount = subAgents.filter(a => a.role === 'Pincode Agent').length;
      const stateAgentsCount = (await Agent.countDocuments({ role: 'State Agent' })) || 1;

      const totalAgentsCount = districtAgentsCount + divisionalAgentsCount + pincodeAgentsCount;

      const registeredDistricts = new Set(
        subAgents.filter(a => a.role === 'District Agent' || (a.district && a.district !== 'Unassigned' && a.district !== 'Unassigned District')).map(a => a.district || a.name)
      );
      const registeredDivisions = new Set(
        subAgents.filter(a => a.role === 'Divisional Agent' || (a.division && a.division !== 'Unassigned' && a.division !== 'Unassigned Division')).map(a => a.division || a.name)
      );

      const districtsCount = districtAgentsCount > 0 ? Math.max(registeredDistricts.size, districtAgentsCount) : registeredDistricts.size;
      const divisionsCount = divisionalAgentsCount > 0 ? Math.max(registeredDivisions.size, divisionalAgentsCount) : registeredDivisions.size;

      const shopsRegistered = await Shop.countDocuments({});
      const activeShops = await Shop.countDocuments({ verificationStatus: 'Verified' });
      const pendingReportsCount = await Report.countDocuments({ status: 'Pending' });

      const recentActivities = await ActivityLog.find({})
        .populate('user', 'email role')
        .sort({ createdAt: -1 })
        .limit(10);

      metrics = {
        totalAgentsCount,
        divisionsCount,
        districtsCount,
        pincodeAgentsCount,
        shopsRegisteredCount: shopsRegistered,
        totalShops: shopsRegistered,
        activeShops,
        pendingReportsCount,
        agentDistribution: {
          stateAgents: stateAgentsCount,
          districtAgents: districtAgentsCount,
          divisionalAgents: divisionalAgentsCount,
          pincodeAgents: pincodeAgentsCount,
        },
        recentActivities,
        trendData: [],
      };

    } else if (role === 'Divisional Agent') {
      const agentProfile = await Agent.findOne({ user: req.user._id });
      const resolvedDivision = agentProfile?.division || req.user.division || 'Attur Division';
      const resolvedDistrict = agentProfile?.district || req.user.district || 'Salem District';
      const resolvedState = agentProfile?.state || req.user.state || 'Tamil Nadu';

      const divRegex = new RegExp(resolvedDivision.replace(/Division/i, '').trim(), 'i');

      const subAgents = await Agent.find({
        $or: [{ division: divRegex }, { district: resolvedDistrict }]
      });
      const pincodeAgentsCount = subAgents.filter(a => a.role === 'Pincode Agent').length;
      const divisionalPincodeAgents = subAgents.filter(a => a.role === 'Pincode Agent' && a.pincode && a.pincode !== 'Unassigned' && a.pincode !== 'Unassigned Pincode');
      const uniquePincodes = new Set(divisionalPincodeAgents.map(a => a.pincode));
      const pincodesCount = uniquePincodes.size || (pincodeAgentsCount > 0 ? 1 : 0);

      const shopsRegistered = await Shop.countDocuments({ division: divRegex });
      const pendingReportsCount = await Report.countDocuments({ assignedTo: req.user._id, status: 'Pending' });

      const pincodeStats = await Shop.aggregate([
        { $match: { division: divRegex } },
        { $group: { _id: '$pincode', count: { $sum: 1 } } }
      ]);

      const subAgentIds = subAgents.map(a => a.user);
      const recentActivities = await ActivityLog.find({ user: { $in: [...subAgentIds, req.user._id] } })
        .populate('user', 'email role')
        .sort({ createdAt: -1 })
        .limit(10);

      metrics = {
        division: resolvedDivision,
        district: resolvedDistrict,
        districtsCount: 1,
        districtAgentsCount: 1,
        pincodesCount: pincodesCount,
        pincodeAgentsCount: pincodeAgentsCount,
        shopsRegisteredCount: shopsRegistered,
        pendingReportsCount,
        agentDistribution: {
          districtAgents: 1,
          pincodeAgents: pincodeAgentsCount,
        },
        districtPerformance: pincodeStats.map(p => ({ name: p._id || 'General', value: p.count })),
        recentActivities,
      };

    } else if (role === 'District Agent') {
      const agentProfile = await Agent.findOne({ user: req.user._id });
      const resolvedDistrict = agentProfile?.district || req.user.district || 'Salem District';
      const resolvedState = agentProfile?.state || req.user.state || 'Tamil Nadu';

      const districtRegex = new RegExp(resolvedDistrict.replace(/District/i, '').trim(), 'i');

      const subAgents = await Agent.find({
        $or: [{ district: districtRegex }, { state: resolvedState }]
      });
      
      const districtPincodeAgents = subAgents.filter(a => a.role === 'Pincode Agent' && (a.district ? districtRegex.test(a.district) : true));
      const districtDivisionalAgents = subAgents.filter(a => a.role === 'Divisional Agent' && (a.district ? districtRegex.test(a.district) : true));

      const districtShops = await Shop.find({ district: districtRegex });
      const shopsRegistered = districtShops.length;
      const reportsSubmittedCount = await Report.countDocuments({ createdBy: { $in: subAgents.map(a => a.user) } });

      const pincodeStats = await Shop.aggregate([
        { $match: { district: districtRegex } },
        { $group: { _id: '$pincode', count: { $sum: 1 } } }
      ]);

      const subAgentIds = subAgents.map(a => a.user);
      const recentActivities = await ActivityLog.find({ user: { $in: [...subAgentIds, req.user._id] } })
        .populate('user', 'email role')
        .sort({ createdAt: -1 })
        .limit(10);

      metrics = {
        district: resolvedDistrict,
        pincodesCount: pincodeStats.length,
        pincodeAgentsCount: districtPincodeAgents.length,
        divisionalAgentsCount: districtDivisionalAgents.length,
        shopsRegisteredCount: shopsRegistered,
        reportsSubmittedCount: reportsSubmittedCount,
        pincodeOverview: pincodeStats.map(p => ({ pin: p._id || 'General', shops: p.count })),
        recentActivities,
      };

    } else if (role === 'Pincode Agent') {
      const agentProfile = await Agent.findOne({ user: req.user._id });
      if (!agentProfile) {
        res.status(404);
        throw new Error('Pincode Agent profile not found');
      }

      const { pincode } = agentProfile;

      const registeredShopsCount = await Shop.countDocuments({ createdBy: req.user._id });
      const pendingVerificationCount = await Shop.countDocuments({ createdBy: req.user._id, verificationStatus: 'Pending' });
      const verifiedCount = await Shop.countDocuments({ createdBy: req.user._id, verificationStatus: 'Verified' });
      const rejectedCount = await Shop.countDocuments({ createdBy: req.user._id, verificationStatus: 'Rejected' });
      const reportsSubmittedCount = await Report.countDocuments({ createdBy: req.user._id });

      const todayVisits = await Shop.countDocuments({
        createdBy: req.user._id,
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      });

      const verificationStatus = {
        verified: verifiedCount,
        pending: pendingVerificationCount,
        rejected: rejectedCount,
      };

      const shopTrends = [
        { day: 'Mon', value: 4 },
        { day: 'Tue', value: 8 },
        { day: 'Wed', value: 5 },
        { day: 'Thu', value: 10 },
        { day: 'Fri', value: 7 },
        { day: 'Sat', value: 3 },
      ];

      const recentActivities = await ActivityLog.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5);

      metrics = {
        todayVisits: todayVisits,
        registeredShopsCount,
        pendingVerificationCount,
        reportsSubmittedCount,
        verificationStatus,
        shopTrends,
        recentActivities,
      };
    } else if (role === 'Admin') {
      const totalUsers = await User.countDocuments();
      const totalAgents = await Agent.countDocuments();
      const totalShops = await Shop.countDocuments();
      const totalReports = await Report.countDocuments();

      metrics = {
        totalUsers,
        totalAgents,
        totalShops,
        totalReports,
      };
    }

    res.json(metrics);
  } catch (error) {
    next(error);
  }
};

export const resetDashboardDatabase = async (req, res, next) => {
  try {
    // Delete all shops, reports, and activity logs
    await Shop.deleteMany({});
    await Report.deleteMany({});
    await ActivityLog.deleteMany({});

    // Delete all sub-agent profiles (exclude State Agent)
    await Agent.deleteMany({ role: { $ne: 'State Agent' } });

    // Delete all users except State Agent
    await User.deleteMany({ role: { $ne: 'State Agent' } });

    // Seed default hierarchy database structure
    await seedData(false);

    res.json({ message: 'Database reset and default hierarchy re-seeded successfully!' });
  } catch (error) {
    next(error);
  }
};
