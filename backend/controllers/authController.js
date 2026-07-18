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
