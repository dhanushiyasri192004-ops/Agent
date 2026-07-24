import Shop from '../models/Shop.js';
import Agent from '../models/Agent.js';
import ActivityLog from '../models/ActivityLog.js';
import Notification from '../models/Notification.js';
import Commission from '../models/Commission.js';

export const registerShop = async (req, res, next) => {
  const { name, ownerName, email, phone, address, pincode } = req.body;

  try {
    if (req.user.role !== 'Pincode Agent') {
      res.status(403);
      throw new Error('Only Pincode Agents can register shops');
    }

    const agent = await Agent.findOne({ user: req.user._id });
    if (!agent) {
      res.status(404);
      throw new Error('Agent profile not found');
    }

    if (agent.pincode !== pincode) {
      res.status(400);
      throw new Error(`You are only authorized to register shops in your assigned pincode: ${agent.pincode}`);
    }

    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a shop document (Image/PDF)');
    }

    const documentUrl = `/uploads/${req.file.filename}`;

    const shop = await Shop.create({
      name,
      ownerName,
      email,
      phone,
      address,
      pincode,
      state: agent.state,
      division: agent.division,
      district: agent.district,
      documentUrl,
      createdBy: req.user._id,
      verificationStatus: 'Pending',
    });

    if (agent.parent) {
      await Notification.create({
        recipient: agent.parent,
        sender: req.user._id,
        message: `New shop registration submitted: ${name} in pincode ${pincode}`,
      });
    }

    agent.metrics.completedShops += 1;
    await agent.save();

    await ActivityLog.create({
      user: req.user._id,
      action: 'Register Shop',
      description: `Registered shop ${name} under pincode ${pincode}`,
    });

    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    next(error);
  }
};

export const getShops = async (req, res, next) => {
  try {
    const role = req.user.role;
    let query = {};

    if (role === 'Pincode Agent') {
      query = { createdBy: req.user._id };
    } else if (role === 'Admin') {
      query = {};
    } else {
      const agentProfile = await Agent.findOne({ user: req.user._id });
      if (!agentProfile) {
        res.status(404);
        throw new Error('Agent profile not found');
      }

      if (role === 'State Agent') {
        query = { state: agentProfile.state };
      } else if (role === 'Divisional Agent') {
        query = { state: agentProfile.state, division: agentProfile.division };
      } else if (role === 'District Agent') {
        query = { state: agentProfile.state, division: agentProfile.division, district: agentProfile.district };
      }
    }

    const shops = await Shop.find(query).populate('createdBy', 'email');
    res.json(shops);
  } catch (error) {
    next(error);
  }
};

export const verifyShop = async (req, res, next) => {
  const { id } = req.params;
  const { status, comments } = req.body;

  try {
    if (req.user.role === 'Pincode Agent') {
      res.status(403);
      throw new Error('Pincode Agents cannot verify shops');
    }

    const shop = await Shop.findById(id);
    if (!shop) {
      res.status(404);
      throw new Error('Shop not found');
    }

    shop.verificationStatus = status;
    shop.comments = comments || '';
    await shop.save();

    if (status === 'Verified') {
      const existingComm = await Commission.findOne({ shopId: shop._id });
      if (!existingComm) {
        // Resolve agent hierarchy for the shop using regex matching
        const pincodeAgent = await Agent.findOne({ pincode: shop.pincode, role: 'Pincode Agent' });
        const divisionalAgent = await Agent.findOne({ division: new RegExp(shop.division.replace(/Division/i, '').trim(), 'i'), role: 'Divisional Agent' });
        const districtAgent = await Agent.findOne({ district: new RegExp(shop.district.replace(/District/i, '').trim(), 'i'), role: 'District Agent' });
        const stateAgent = await Agent.findOne({ state: new RegExp(shop.state.trim(), 'i'), role: 'State Agent' });

        // Update wallets
        if (pincodeAgent) {
          pincodeAgent.walletBalance = (pincodeAgent.walletBalance || 0) + 150;
          await pincodeAgent.save();
        }
        if (divisionalAgent) {
          divisionalAgent.walletBalance = (divisionalAgent.walletBalance || 0) + 50;
          await divisionalAgent.save();
        }
        if (districtAgent) {
          districtAgent.walletBalance = (districtAgent.walletBalance || 0) + 50;
          await districtAgent.save();
        }
        if (stateAgent) {
          stateAgent.walletBalance = (stateAgent.walletBalance || 0) + 50;
          await stateAgent.save();
        }

        // Create Commission record
        await Commission.create({
          shopId: shop._id,
          registrationFee: 500,
          pincodeAgentId: pincodeAgent ? pincodeAgent.user : null,
          pincodeCommission: 150,
          divisionalAgentId: divisionalAgent ? divisionalAgent.user : null,
          divisionalCommission: 50,
          districtAgentId: districtAgent ? districtAgent.user : null,
          districtCommission: 50,
          stateAgentId: stateAgent ? stateAgent.user : null,
          stateCommission: 50,
          companyCommission: 200,
          status: 'Paid',
        });
      }
    }

    await Notification.create({
      recipient: shop.createdBy,
      sender: req.user._id,
      message: `Your registered shop "${shop.name}" has been ${status}. Notes: ${comments || 'None'}`,
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'Verify Shop',
      description: `Shop "${shop.name}" marked as ${status}`,
    });

    res.json({
      success: true,
      shop,
    });
  } catch (error) {
    next(error);
  }
};
