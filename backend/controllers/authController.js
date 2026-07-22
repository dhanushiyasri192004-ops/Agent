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
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      let agentInfo = null;
      if (user.role !== 'Admin') {
        agentInfo = await Agent.findOne({ user: user._id });
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
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
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
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email.');
    }

    // New user starts as Inactive pending Admin KYC approval!
    const user = await User.create({
      email,
      password,
      role,
      status: 'Inactive',
    });

    let resolvedState = state || 'Tamil Nadu';
    let resolvedDistrict = district || '';
    let resolvedDivision = division || '';

    if (role === 'Pincode Agent' && pincode) {
      const mappedInfo = pincodeDataMap[pincode];
      if (mappedInfo) {
        resolvedState = mappedInfo.state;
        resolvedDistrict = mappedInfo.district;
        resolvedDivision = mappedInfo.division;
      }
    }

    const agent = await Agent.create({
      user: user._id,
      name,
      phone,
      role,
      state: resolvedState,
      division: resolvedDivision,
      district: resolvedDistrict,
      pincode: role === 'Pincode Agent' ? pincode : '',
      status: 'Inactive',
    });

    await ActivityLog.create({
      user: user._id,
      action: 'Register',
      description: `New agent self-registered: ${name} (${email}) pending KYC verification`,
    });

    res.status(201).json({
      success: true,
      message: 'Registration application submitted! Your agent account is pending KYC verification by the Admin team.',
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
