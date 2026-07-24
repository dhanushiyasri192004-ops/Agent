import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import User from './models/User.js';
import Agent from './models/Agent.js';

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'tn@gmail.com';
    const user = await User.findOne({ email });
    const agent = await Agent.findOne({ user: user ? user._id : null });

    console.log('=== USER ===');
    console.log(user);
    console.log('=== AGENT ===');
    console.log(agent);

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

check();
