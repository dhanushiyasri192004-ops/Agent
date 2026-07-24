import User from '../models/User.js';
import Agent from '../models/Agent.js';
import ActivityLog from '../models/ActivityLog.js';

const getSubRole = (role) => {
  if (role === 'Admin') return 'State Agent';
  if (role === 'State Agent') return 'District Agent';
  if (role === 'District Agent') return 'Divisional Agent';
  if (role === 'Divisional Agent') return 'Pincode Agent';
  return null;
};

export const createAgent = async (req, res, next) => {
  const { email, password, name, phone, state, division, district, pincode } = req.body;
  const creatorRole = req.user.role;
  const targetRole = getSubRole(creatorRole);

  if (!targetRole) {
    res.status(403);
    return next(new Error('You do not have permission to create agents.'));
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email.');
    }

    let parentAgent = null;
    if (creatorRole !== 'Admin') {
      parentAgent = await Agent.findOne({ user: req.user._id });
      if (!parentAgent) {
        res.status(404);
        throw new Error('Your Agent profile could not be found.');
      }

      if (parentAgent.state !== state) {
        res.status(400);
        throw new Error(`Geographical mismatch: You are restricted to state "${parentAgent.state}".`);
      }

      if (creatorRole === 'District Agent' && parentAgent.district !== district) {
        res.status(400);
        throw new Error(`Geographical mismatch: You are restricted to district "${parentAgent.district}".`);
      }

      if (creatorRole === 'Divisional Agent' && parentAgent.division !== division) {
        res.status(400);
        throw new Error(`Geographical mismatch: You are restricted to division "${parentAgent.division}".`);
      }
    }

    const newUser = await User.create({
      email,
      password,
      role: targetRole,
      status: 'Active',
    });

    const newAgent = await Agent.create({
      user: newUser._id,
      parent: req.user._id,
      name,
      phone,
      role: targetRole,
      state,
      division: division || (parentAgent ? parentAgent.division : ''),
      district: district || (parentAgent ? parentAgent.district : ''),
      pincode: pincode || '',
      status: 'Active',
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'Create Agent',
      description: `Created ${targetRole}: ${name} (${email})`,
      ipAddress: req.ip || '',
    });

    res.status(201).json({
      success: true,
      agent: newAgent,
    });
  } catch (error) {
    next(error);
  }
};

export const getMySubAgents = async (req, res, next) => {
  try {
    const creatorRole = req.user.role;
    let query = {};

    if (creatorRole === 'Admin') {
      query = {};
    } else {
      const parentAgent = await Agent.findOne({ user: req.user._id });
      const userState = parentAgent ? parentAgent.state : 'Tamil Nadu';

      if (creatorRole === 'State Agent') {
        query = {
          $or: [
            { state: userState },
            { state: { $exists: false } },
            { state: '' }
          ]
        };
      } else if (creatorRole === 'District Agent') {
        const userDistrict = parentAgent ? parentAgent.district : '';
        const districtRegex = userDistrict ? new RegExp(userDistrict.replace(/District/i, '').trim(), 'i') : null;
        query = {
          role: { $in: ['Divisional Agent', 'Pincode Agent'] }
        };
        if (districtRegex) {
          query.district = { $regex: districtRegex };
        }
      } else if (creatorRole === 'Divisional Agent') {
        const userDivision = parentAgent ? parentAgent.division : '';
        query = {
          role: 'Pincode Agent'
        };
        if (userDivision) {
          query.division = userDivision;
        }
      } else {
        query = { user: req.user._id };
      }
    }

    const agents = await Agent.find(query).populate('user', 'email status');
    res.json(agents);
  } catch (error) {
    next(error);
  }
};

export const toggleAgentStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const agent = await Agent.findById(id);
    if (!agent) {
      res.status(404);
      throw new Error('Agent not found');
    }

    const agentUser = await User.findById(agent.user);
    if (agentUser) {
      agentUser.status = status;
      await agentUser.save();
    }

    agent.status = status;
    await agent.save();

    await ActivityLog.create({
      user: req.user._id,
      action: 'Update Status',
      description: `Updated status of Agent ${agent.name} to ${status}`,
    });

    res.json({ success: true, agent });
  } catch (error) {
    next(error);
  }
};

export const updateAgent = async (req, res, next) => {
  const { id } = req.params;
  const { name, phone, state, district, division, pincode } = req.body;

  try {
    const agent = await Agent.findById(id);
    if (!agent) {
      res.status(404);
      throw new Error('Agent not found');
    }

    agent.name = name || agent.name;
    agent.phone = phone || agent.phone;
    agent.state = state || agent.state;
    agent.district = district || agent.district;
    agent.division = division || agent.division;
    agent.pincode = pincode || agent.pincode;

    await agent.save();

    await ActivityLog.create({
      user: req.user._id,
      action: 'Update Agent',
      description: `Updated Agent details for: ${agent.name}`,
    });

    res.json({ success: true, agent });
  } catch (error) {
    next(error);
  }
};

export const deleteAgent = async (req, res, next) => {
  const { id } = req.params;
  try {
    const agent = await Agent.findById(id);
    if (!agent) {
      res.status(404);
      throw new Error('Agent not found');
    }

    if (agent.user) {
      await User.findByIdAndDelete(agent.user);
    }
    await Agent.findByIdAndDelete(id);

    await ActivityLog.create({
      user: req.user._id,
      action: 'Delete Agent',
      description: `Deleted Agent: ${agent.name} (${agent.role})`,
      ipAddress: req.ip || '',
    });

    res.json({ success: true, message: 'Agent deleted permanently from database.' });
  } catch (error) {
    next(error);
  }
};
