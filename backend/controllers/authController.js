import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Agent from '../models/Agent.js';
import ActivityLog from '../models/ActivityLog.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      if (cleanEmail === 'tn@gmail.com') {
        user = await User.create({
          email: cleanEmail,
          password: password || 'Tn@12345',
          role: 'State Agent',
          status: 'Active',
        });
      } else {
        res.status(401);
        throw new Error('User not found. Please register your agent profile first.');
      }
    } else {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password.');
      }

      // Auto-correct stale roles for test email tn@gmail.com
      if (cleanEmail === 'tn@gmail.com' && user.role !== 'State Agent') {
        user.role = 'State Agent';
        await user.save();
        
        let agent = await Agent.findOne({ user: user._id });
        if (agent) {
          agent.role = 'State Agent';
          agent.pincode = '';
          agent.district = '';
          agent.division = '';
          await agent.save();
        }
      }
    }

    if (user.status !== 'Active') {
      user.status = 'Active';
      await user.save();
    }

    let agentInfo = null;
    if (user.role !== 'Admin') {
      agentInfo = await Agent.findOne({ user: user._id });
      if (!agentInfo) {
        agentInfo = await Agent.create({
          user: user._id,
          name: cleanEmail.split('@')[0],
          phone: '9876543210',
          role: user.role,
          state: 'Tamil Nadu',
          district: (user.role === 'District Agent' || user.role === 'Divisional Agent' || user.role === 'Pincode Agent') ? 'Salem District' : '',
          division: (user.role === 'Divisional Agent' || user.role === 'Pincode Agent') ? 'Attur Division' : '',
          pincode: (user.role === 'Pincode Agent') ? '636112' : '',
          status: 'Active',
        });
      } else if (agentInfo.role && agentInfo.role !== user.role) {
        // Sync user role with registered agent profile role
        user.role = agentInfo.role;
        await user.save();
      }
    }

    await ActivityLog.create({
      user: user._id,
      action: 'Login',
      description: `User logged in with role ${user.role}`,
      ipAddress: req.ip || '',
    });

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
      name: agentInfo ? agentInfo.name : 'System Admin',
      agentInfo,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found with this email');
    }

    user.password = 'reset123';
    await user.save();

    res.json({
      success: true,
      message: 'Password reset link sent (Simulated). For testing, password has been temporarily reset to: reset123',
    });
  } catch (error) {
    next(error);
  }
};

const pincodeDataMap = {
  '641001': { state: 'Tamil Nadu', district: 'Coimbatore District', division: 'Chennai Division' },
  '641002': { state: 'Tamil Nadu', district: 'Coimbatore District', division: 'Chennai Division' },
  '600001': { state: 'Tamil Nadu', district: 'Chennai District', division: 'Chennai Division' },
  '600002': { state: 'Tamil Nadu', district: 'Chennai District', division: 'Chennai Division' },
  '600040': { state: 'Tamil Nadu', district: 'Chennai District', division: 'Chennai Division' },
  '625001': { state: 'Tamil Nadu', district: 'Madurai District', division: 'Madurai Division' },
  '636112': { state: 'Tamil Nadu', district: 'Salem District', division: 'Salem East Division' },
};

export const registerUser = async (req, res, next) => {
  const { email, password, name, phone, role, pincode, state, district, division } = req.body;

  try {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    let user = await User.findOne({ email: cleanEmail });

    let resolvedState = state || 'Tamil Nadu';
    let resolvedDistrict = district || '';
    let resolvedDivision = division || '';

    if (pincode && pincodeDataMap[pincode]) {
      const mappedInfo = pincodeDataMap[pincode];
      resolvedState = state || mappedInfo.state;
      resolvedDistrict = district || mappedInfo.district;
      resolvedDivision = division || mappedInfo.division;
    }

    if (user) {
      // Update existing account to new role and location details
      user.role = role;
      user.password = password;
      user.status = 'Active';
      await user.save();

      let agent = await Agent.findOne({ user: user._id });
      if (agent) {
        agent.name = name || agent.name;
        agent.phone = phone || agent.phone;
        agent.role = role;
        agent.state = resolvedState;
        agent.district = resolvedDistrict;
        agent.division = resolvedDivision;
        agent.pincode = pincode || agent.pincode || '';
        agent.status = 'Active';
        await agent.save();
      } else {
        agent = await Agent.create({
          user: user._id,
          name: name || cleanEmail.split('@')[0],
          phone: phone || '9876543210',
          role: role,
          state: resolvedState,
          district: resolvedDistrict,
          division: resolvedDivision,
          pincode: pincode || '',
          status: 'Active',
        });
      }
    } else {
      user = await User.create({
        email: cleanEmail,
        password,
        role,
        status: 'Active',
      });

      await Agent.create({
        user: user._id,
        name: name || cleanEmail.split('@')[0],
        phone: phone || '9876543210',
        role,
        state: resolvedState,
        district: resolvedDistrict,
        division: resolvedDivision,
        pincode: pincode || '',
        status: 'Active',
      });
    }

    await ActivityLog.create({
      user: user._id,
      action: 'Register',
      description: `New agent self-registered: ${name} (${cleanEmail}) with role ${role}`,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Account is active.',
    });
  } catch (error) {
    next(error);
  }
};

export const clearAllData = async (req, res, next) => {
  try {
    await User.deleteMany({});
    await Agent.deleteMany({});
    await Shop.deleteMany({});
    await Report.deleteMany({});
    await Notification.deleteMany({});
    await ActivityLog.deleteMany({});
    if (res) {
      res.json({ message: 'All mock database data successfully wiped clean.' });
    }
  } catch (error) {
    if (next) next(error);
  }
};
