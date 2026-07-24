import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Agent from './models/Agent.js';
import Shop from './models/Shop.js';

dotenv.config();

const divisionDistrictMap = {
  'Chennai Division': ['Chennai', 'Kanchipuram', 'Tiruvallur'],
  'Coimbatore Division': ['Coimbatore', 'Tiruppur', 'Erode'],
  'Madurai Division': ['Madurai', 'Dindigul', 'Theni'],
  'Trichy Division': ['Trichy', 'Karur', 'Pudukkottai'],
  'Salem Division': ['Salem', 'Namakkal', 'Dharmapuri']
};

export const seedData = async (shouldConnect = true) => {
  try {
    if (shouldConnect) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agent-management';
      console.log(`Connecting to database to seed live data: ${mongoUri}`);
      await mongoose.connect(mongoUri);
    }

    // Keep State Agent user tn@gmail.com if exists, otherwise create it
    let stateUser = await User.findOne({ email: 'tn@gmail.com' });
    if (!stateUser) {
      stateUser = await User.create({
        email: 'tn@gmail.com',
        password: 'Tn@12345',
        role: 'State Agent',
        status: 'Active'
      });
    }

    let stateAgent = await Agent.findOne({ user: stateUser._id });
    if (!stateAgent) {
      stateAgent = await Agent.create({
        user: stateUser._id,
        name: 'Tamil Nadu State Agent',
        phone: '9876543210',
        role: 'State Agent',
        state: 'Tamil Nadu',
        status: 'Active'
      });
    }

    // Now seed Divisional Agents
    const divisions = Object.keys(divisionDistrictMap);
    const divisionalUsers = [];
    const divisionalAgents = [];

    for (let i = 0; i < divisions.length; i++) {
      const divName = divisions[i];
      const name = `${divName.split(' ')[0]} Divisional Agent`;
      const email = `${divName.split(' ')[0].toLowerCase()}@div.com`;
      
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          email,
          password: 'Password123',
          role: 'Divisional Agent',
          status: 'Active'
        });
      }
      divisionalUsers.push(user);

      let agent = await Agent.findOne({ user: user._id });
      if (!agent) {
        agent = await Agent.create({
          user: user._id,
          parent: stateUser._id,
          name,
          phone: `980000000${i}`,
          role: 'Divisional Agent',
          state: 'Tamil Nadu',
          division: divName,
          status: 'Active'
        });
      }
      divisionalAgents.push(agent);
    }

    // Now seed District Agents
    const districtAgents = [];
    let phoneCounter = 10;
    
    for (const [divName, districts] of Object.entries(divisionDistrictMap)) {
      const parentDivAgent = divisionalAgents.find(a => a.division === divName);
      
      for (const distName of districts) {
        const email = `${distName.toLowerCase()}@dist.com`;
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            password: 'Password123',
            role: 'District Agent',
            status: 'Active'
          });
        }

        let agent = await Agent.findOne({ user: user._id });
        if (!agent) {
          agent = await Agent.create({
            user: user._id,
            parent: parentDivAgent ? parentDivAgent.user : stateUser._id,
            name: `${distName} District Agent`,
            phone: `98000000${phoneCounter++}`,
            role: 'District Agent',
            state: 'Tamil Nadu',
            division: divName,
            district: `${distName} District`,
            status: 'Active'
          });
        }
        districtAgents.push(agent);
      }
    }

    // Now seed Pincode Agents
    const pincodeAgents = [];
    const pins = ['600001', '600002', '641002', '641003', '625001', '620001', '636001'];
    
    for (let i = 0; i < pins.length; i++) {
      const pin = pins[i];
      const email = `agent${pin}@pin.com`;
      
      // Determine division and district based on PIN
      let division = 'Chennai Division';
      let district = 'Chennai District';
      if (pin.startsWith('641')) {
        division = 'Coimbatore Division';
        district = 'Coimbatore District';
      } else if (pin.startsWith('625')) {
        division = 'Madurai Division';
        district = 'Madurai District';
      } else if (pin.startsWith('620')) {
        division = 'Trichy Division';
        district = 'Trichy District';
      } else if (pin.startsWith('636')) {
        division = 'Salem Division';
        district = 'Salem District';
      }

      const parentDistAgent = districtAgents.find(a => a.district === district);

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          email,
          password: 'Password123',
          role: 'Pincode Agent',
          status: 'Active'
        });
      }

      let agent = await Agent.findOne({ user: user._id });
      if (!agent) {
        agent = await Agent.create({
          user: user._id,
          parent: parentDistAgent ? parentDistAgent.user : stateUser._id,
          name: `Agent ${pin}`,
          phone: `9700000${pin}`,
          role: 'Pincode Agent',
          state: 'Tamil Nadu',
          division,
          district,
          pincode: pin,
          status: 'Active'
        });
      }
      pincodeAgents.push(agent);
    }

    // Now seed Shops
    const shopNames = [
      { name: 'Kovai Supermarket', owner: 'Mani K', pin: '641002', div: 'Coimbatore Division', dist: 'Coimbatore District' },
      { name: 'Chennai Electronics', owner: 'Ramesh R', pin: '600001', div: 'Chennai Division', dist: 'Chennai District' },
      { name: 'Madurai Spicy Corner', owner: 'Pandian S', pin: '625001', div: 'Madurai Division', dist: 'Madurai District' },
      { name: 'Trichy Textiles', owner: 'Velu M', pin: '620001', div: 'Trichy Division', dist: 'Trichy District' },
      { name: 'Salem Coffee Bar', owner: 'Dinesh P', pin: '636001', div: 'Salem Division', dist: 'Salem District' }
    ];

    for (let i = 0; i < shopNames.length; i++) {
      const s = shopNames[i];
      const creator = pincodeAgents.find(a => a.pincode === s.pin) || stateUser;

      let shop = await Shop.findOne({ name: s.name });
      if (!shop) {
        await Shop.create({
          name: s.name,
          ownerName: s.owner,
          email: `${s.name.toLowerCase().replace(/ /g, '')}@shop.com`,
          phone: `960000000${i}`,
          address: `12, Main Bazaar, ${s.dist}`,
          pincode: s.pin,
          state: 'Tamil Nadu',
          division: s.div,
          district: s.dist,
          documentUrl: 'https://example.com/doc.pdf',
          verificationStatus: i % 2 === 0 ? 'Verified' : 'Pending',
          createdBy: creator.user || creator._id
        });
      }
    }

    console.log('Live demo data seeded successfully!');
    if (shouldConnect) {
      await mongoose.disconnect();
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding data:', error);
    if (shouldConnect) {
      process.exit(1);
    }
    throw error;
  }
};

if (process.argv[1] && process.argv[1].endsWith('seedDB.js')) {
  seedData();
}
