import Commission from '../models/Commission.js';
import Agent from '../models/Agent.js';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';

export const getMyCommissions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let query = {};
    if (role === 'Pincode Agent') query.pincodeAgentId = userId;
    else if (role === 'Divisional Agent') query.divisionalAgentId = userId;
    else if (role === 'District Agent') query.districtAgentId = userId;
    else if (role === 'State Agent') query.stateAgentId = userId;
    
    // Admin gets all commission records
    if (role === 'Admin') query = {};

    const list = await Commission.find(query)
      .populate({
        path: 'shopId',
        select: 'name ownerName address pincode division district state verificationStatus createdAt'
      })
      .sort({ createdAt: -1 });

    const agent = await Agent.findOne({ user: userId });

    res.json({
      success: true,
      commissions: list,
      walletBalance: agent ? agent.walletBalance : 0
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminCommissionStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('Not authorized as Admin');
    }

    const verifiedShopsCount = await Shop.countDocuments({ verificationStatus: 'Verified' });
    
    const totalRevenue = verifiedShopsCount * 500;
    const paidToPincode = verifiedShopsCount * 150;
    const paidToDivisional = verifiedShopsCount * 50;
    const paidToDistrict = verifiedShopsCount * 50;
    const paidToState = verifiedShopsCount * 50;
    const companyEarnings = verifiedShopsCount * 200;
    const totalCommissionPaid = paidToPincode + paidToDivisional + paidToDistrict + paidToState;

    res.json({
      success: true,
      totalRegistrationFees: totalRevenue,
      paidToPincode,
      paidToDivisional,
      paidToDistrict,
      paidToState,
      companyEarnings,
      totalCommissionPaid,
      totalVerifiedShops: verifiedShopsCount
    });
  } catch (error) {
    next(error);
  }
};

export const requestPayout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const agent = await Agent.findOne({ user: userId });

    if (!agent) {
      res.status(404);
      throw new Error('Agent profile not found');
    }

    const currentBalance = agent.walletBalance || 0;
    if (currentBalance <= 0) {
      res.status(400);
      throw new Error('Wallet balance must be greater than zero to request payout');
    }

    // Reset wallet balance upon payout request
    agent.walletBalance = 0;
    await agent.save();

    await Notification.create({
      recipient: userId,
      sender: userId,
      message: `Payout request of ₹ ${currentBalance} submitted to accounting.`,
    });

    await ActivityLog.create({
      user: userId,
      action: 'Request Payout',
      description: `Requested a commission payout of ₹ ${currentBalance}`,
    });

    res.json({
      success: true,
      message: `Successfully requested payout of ₹ ${currentBalance}`,
      walletBalance: 0
    });
  } catch (error) {
    next(error);
  }
};
