import User from '../models/User.js';
import Agent from '../models/Agent.js';

export const seedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`Database initialized with ${userCount} existing user account(s).`);
      return;
    }

    console.log('Database is empty. Initializing initial agent hierarchy (State, District, Division, Pincode)...');

    // 1. State Agent
    const stateUser = await User.create({
      email: 'tn@gmail.com',
      password: 'Tn@12345',
      role: 'State Agent',
      status: 'Active'
    });

    const stateAgent = await Agent.create({
      user: stateUser._id,
      name: 'Tamil Nadu State Agent',
      phone: '9876543210',
      role: 'State Agent',
      state: 'Tamil Nadu',
      status: 'Active'
    });

    // 2. District Agent
    const distUser = await User.create({
      email: 'salem@dist.com',
      password: 'Password123',
      role: 'District Agent',
      status: 'Active'
    });

    const distAgent = await Agent.create({
      user: distUser._id,
      parent: stateUser._id,
      name: 'Salem District Agent',
      phone: '9876543211',
      role: 'District Agent',
      state: 'Tamil Nadu',
      district: 'Salem District',
      status: 'Active'
    });

    // 3. Divisional Agent
    const divUser = await User.create({
      email: 'attur@div.com',
      password: 'Password123',
      role: 'Divisional Agent',
      status: 'Active'
    });

    const divAgent = await Agent.create({
      user: divUser._id,
      parent: distUser._id,
      name: 'Attur Divisional Agent',
      phone: '9876543212',
      role: 'Divisional Agent',
      state: 'Tamil Nadu',
      district: 'Salem District',
      division: 'Attur Division',
      status: 'Active'
    });

    // 4. Pincode Agent
    const pinUser = await User.create({
      email: 'agent636112@pin.com',
      password: 'Password123',
      role: 'Pincode Agent',
      status: 'Active'
    });

    await Agent.create({
      user: pinUser._id,
      parent: divUser._id,
      name: 'Agent 636112',
      phone: '9876543213',
      role: 'Pincode Agent',
      state: 'Tamil Nadu',
      district: 'Salem District',
      division: 'Attur Division',
      pincode: '636112',
      status: 'Active'
    });

    console.log('Successfully initialized database with State, District, Divisional, and Pincode Agent default accounts.');
  } catch (err) {
    console.error('Error initializing database collections:', err);
  }
};
