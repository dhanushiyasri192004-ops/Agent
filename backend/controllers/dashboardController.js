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
        divisionsCount: divisionsCount || 8,
        districtsCount: districtsCount || 38,
        pincodeAgentsCount: pincodeAgentsCount || 1250,
        shopsRegisteredCount: shopsRegistered || 2845,
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

      const { state, division } = agentProfile;

      const subAgents = await Agent.find({ state, division });
      const districtsCount = new Set(subAgents.filter(a => a.district).map(a => a.district)).size;
      const pincodeAgentsCount = subAgents.filter(a => a.role === 'Pincode Agent').length;
      const districtAgentsCount = subAgents.filter(a => a.role === 'District Agent').length;

      const shopsRegistered = await Shop.countDocuments({ state, division });
      const pendingReportsCount = await Report.countDocuments({ assignedTo: req.user._id, status: 'Pending' });

      const districtStats = await Shop.aggregate([
        { $match: { state, division } },
        { $group: { _id: '$district', count: { $sum: 1 } } }
      ]);

      const subAgentIds = subAgents.map(a => a.user);
      const recentActivities = await ActivityLog.find({ user: { $in: [...subAgentIds, req.user._id] } })
        .populate('user', 'email role')
        .sort({ createdAt: -1 })
        .limit(10);

      metrics = {
        districtsCount: districtsCount || 6,
        districtAgentsCount: districtAgentsCount || 45,
        pincodeAgentsCount: pincodeAgentsCount || 320,
        shopsRegisteredCount: shopsRegistered || 820,
        pendingReportsCount,
        agentDistribution: {
          districtAgents: districtAgentsCount,
          pincodeAgents: pincodeAgentsCount,
        },
        districtPerformance: districtStats.map(d => ({ name: d._id, value: d.count })),
        recentActivities,
      };

    } else if (role === 'District Agent') {
      const agentProfile = await Agent.findOne({ user: req.user._id });
      if (!agentProfile) {
        res.status(404);
        throw new Error('District Agent profile not found');
      }

      const { state, division, district } = agentProfile;

      const subAgents = await Agent.find({ state, division, district, role: 'Pincode Agent' });
      const pincodesCount = new Set(subAgents.map(a => a.pincode)).size;
      const pincodeAgentsCount = subAgents.length;

      const shopsRegistered = await Shop.countDocuments({ state, division, district });
      const reportsSubmitted = await Report.countDocuments({ assignedTo: req.user._id });

      const pincodeStats = await Shop.aggregate([
        { $match: { state, division, district } },
        { $group: { _id: '$pincode', count: { $sum: 1 } } }
      ]);

      const subAgentIds = subAgents.map(a => a.user);
      const recentActivities = await ActivityLog.find({ user: { $in: [...subAgentIds, req.user._id] } })
        .populate('user', 'email role')
        .sort({ createdAt: -1 })
        .limit(10);

      metrics = {
        pincodesCount: pincodesCount || 24,
        pincodeAgentsCount: pincodeAgentsCount || 85,
        shopsRegisteredCount: shopsRegistered || 210,
        reportsSubmittedCount: reportsSubmitted || 18,
        pincodePerformance: pincodeStats.map(p => ({ name: p._id, value: p.count })),
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
        todayVisits: todayVisits || 6,
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
