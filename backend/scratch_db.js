import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Agent from './models/Agent.js';
import Shop from './models/Shop.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log('USERS:', users.map(u => ({ id: u._id, name: u.name, role: u.role, email: u.email })));

    const agents = await Agent.find({});
    console.log('AGENTS:', agents.map(a => ({ id: a._id, user: a.user, name: a.name, role: a.role, state: a.state })));

    const shops = await Shop.find({});
    console.log('SHOPS COUNT:', shops.length);

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
