import User from '../models/User.js';
import Agent from '../models/Agent.js';
import Shop from '../models/Shop.js';
import Report from '../models/Report.js';
import ActivityLog from '../models/ActivityLog.js';

export const getDashboardMetrics = async (req, res, next) => {
  const role = req.user.role;

  try {
    let metrics = {};

    if (role === 'State Agent') {
      const agentProfile = await Agent.findOne({ user: req.user._id });
      if (!agentProfile) {
        res.status(404);
        throw new Error('State Agent profile not found');
      }

      const stateName = agentProfile.state;

      const subAgents = await Agent.find({ state: stateName });
      const divisionsCount = new Set(subAgents.filter(a => a.division).map(a => a.division)).size;
      const districtsCount = new Set(subAgents.filter(a => a.district).map(a => a.district)).size;
      const pincodeAgentsCount = subAgents.filter(a => a.role === 'Pincode Agent').length;
      const divisionalAgentsCount = subAgents.filter(a => a.role === 'Divisional Agent').length;
      const districtAgentsCount = subAgents.filter(a => a.role === 'District Agent').length;

      const shopsRegistered = await Shop.countDocuments({ state: stateName });
      const activeShops = await Shop.countDocuments({ state: stateName, verificationStatus: 'Verified' });

      const pendingReportsCount = await Report.countDocuments({ assignedTo: req.user._id, status: 'Pending' });

      const subAgentIds = subAgents.map(a => a.user);
      const recentActivities = await ActivityLog.find({ user: { $in: [...subAgentIds, req.user._id] } })
        .populate('user', 'email role')
        .sort({ createdAt: -1 })
        .limit(10);

      const divisionStats = await Shop.aggregate([
        { $match: { state: stateName } },
        { $group: { _id: '$division', count: { $sum: 1 } } }
      ]);

      metrics = {
        divisionsCount: divisionsCount,
        districtsCount: districtsCount,
        pincodeAgentsCount: pincodeAgentsCount,
        shopsRegisteredCount: shopsRegistered,
        totalShops: shopsRegistered,
        activeShops,
        pendingReportsCount,
        agentDistribution: {
          divisionalAgents: divisionalAgentsCount,
          districtAgents: districtAgentsCount,
          pincodeAgents: pincodeAgentsCount,
        },
        divisionPerformance: divisionStats.map(d => ({ name: d._id, value: d.count })),
        recentActivities,
      };

    } else if (role === 'Divisional Agent') {
      const agentProfile = await Agent.findOne({ user: req.user._id });
      if (!agentProfile) {
        res.status(404);
        throw new Error('Divisional Agent profile not found');
      }

      const { state, district, division } = agentProfile;

      const subAgents = await Agent.find({ state, district, division });
      const pincodeAgentsCount = subAgents.filter(a => a.role === 'Pincode Agent').length;

      const shopsRegistered = await Shop.countDocuments({ state, district, division });
      const pendingReportsCount = await Report.countDocuments({ assignedTo: req.user._id, status: 'Pending' });

      const pincodeStats = await Shop.aggregate([
        { $match: { state, district, division } },
        { $group: { _id: '$pincode', count: { $sum: 1 } } }
      ]);

      const subAgentIds = subAgents.map(a => a.user);
      const recentActivities = await ActivityLog.find({ user: { $in: [...subAgentIds, req.user._id] } })
        .populate('user', 'email role')
        .sort({ createdAt: -1 })
        .limit(10);

      metrics = {
        districtsCount: 1,
        districtAgentsCount: 1,
        pincodeAgentsCount: pincodeAgentsCount,
        shopsRegisteredCount: shopsRegistered,
        pendingReportsCount,
        agentDistribution: {
          districtAgents: 1,
          pincodeAgents: pincodeAgentsCount,
        },
        districtPerformance: pincodeStats.map(p => ({ name: p._id, value: p.count })),
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
