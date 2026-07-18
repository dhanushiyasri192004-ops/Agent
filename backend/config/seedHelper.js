import User from '../models/User.js';
import Agent from '../models/Agent.js';
import Shop from '../models/Shop.js';
import Report from '../models/Report.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';

export const seedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has data. Skipping auto-seed.');
      return;
    }

    console.log('Database is empty. Running auto-seed...');

    // 1. Create State Agent (Tamil Nadu)
    const stateUser = await User.create({
      email: 'stateagent@forgeindia.com',
      password: 'password123',
      role: 'State Agent',
      status: 'Active',
    });
    const stateAgent = await Agent.create({
      user: stateUser._id,
      parent: null,
      name: 'Tamil Nadu State Agent',
      phone: '9876543210',
      role: 'State Agent',
      state: 'Tamil Nadu',
      status: 'Active',
    });

    // 3. Create Divisional Agent (Chennai Division)
    const divisionalUser = await User.create({
      email: 'divisionagent@forgeindia.com',
      password: 'password123',
      role: 'Divisional Agent',
      status: 'Active',
    });
    const divisionalAgent = await Agent.create({
      user: divisionalUser._id,
      parent: stateUser._id,
      name: 'Chennai Division Agent',
      phone: '9876543211',
      role: 'Divisional Agent',
      state: 'Tamil Nadu',
      division: 'Chennai Division',
      status: 'Active',
    });

    // 4. Create District Agent (Coimbatore District)
    const districtUser = await User.create({
      email: 'districtagent@forgeindia.com',
      password: 'password123',
      role: 'District Agent',
      status: 'Active',
    });
    const districtAgent = await Agent.create({
      user: districtUser._id,
      parent: divisionalUser._id,
      name: 'Coimbatore District Agent',
      phone: '9876543212',
      role: 'District Agent',
      state: 'Tamil Nadu',
      division: 'Chennai Division',
      district: 'Coimbatore District',
      status: 'Active',
    });

    // 5. Create Pincode Agent (641001)
    const pincodeUser = await User.create({
      email: 'pincodeagent@forgeindia.com',
      password: 'password123',
      role: 'Pincode Agent',
      status: 'Active',
    });
    const pincodeAgent = await Agent.create({
      user: pincodeUser._id,
      parent: districtUser._id,
      name: '641001 Pincode Agent',
      phone: '9876543213',
      role: 'Pincode Agent',
      state: 'Tamil Nadu',
      division: 'Chennai Division',
      district: 'Coimbatore District',
      pincode: '641001',
      status: 'Active',
      metrics: {
        targetShops: 100,
        completedShops: 4,
      }
    });

    // 6. Create Mock Shops
    const shopsData = [
      {
        name: 'Murugan Stores',
        ownerName: 'Murugan Ramasamy',
        email: 'muruganstores@gmail.com',
        phone: '9443210987',
        address: '12, Crosscut Road, Gandhipuram',
        pincode: '641001',
        state: 'Tamil Nadu',
        division: 'Chennai Division',
        district: 'Coimbatore District',
        documentUrl: '/uploads/sample-license.pdf',
        verificationStatus: 'Verified',
        createdBy: pincodeUser._id,
      },
      {
        name: 'Kannan Provision Store',
        ownerName: 'Kannan Sundaram',
        email: 'kannanprovision@gmail.com',
        phone: '9443210988',
        address: '56, Oppanakara Street',
        pincode: '641001',
        state: 'Tamil Nadu',
        division: 'Chennai Division',
        district: 'Coimbatore District',
        documentUrl: '/uploads/sample-license.pdf',
        verificationStatus: 'Verified',
        createdBy: pincodeUser._id,
      },
      {
        name: 'Royal Traders',
        ownerName: 'Royal Mohammad',
        email: 'royaltraders@gmail.com',
        phone: '9443210989',
        address: '109, Raja Street',
        pincode: '641001',
        state: 'Tamil Nadu',
        division: 'Chennai Division',
        district: 'Coimbatore District',
        documentUrl: '/uploads/sample-license.pdf',
        verificationStatus: 'Verified',
        createdBy: pincodeUser._id,
      },
      {
        name: 'New City Store',
        ownerName: 'Subramanian A.',
        email: 'newcitystore@gmail.com',
        phone: '9443210990',
        address: '234, D.B. Road, RS Puram',
        pincode: '641001',
        state: 'Tamil Nadu',
        division: 'Chennai Division',
        district: 'Coimbatore District',
        documentUrl: '/uploads/sample-license.pdf',
        verificationStatus: 'Pending',
        createdBy: pincodeUser._id,
      },
    ];

    await Shop.insertMany(shopsData);

    // 7. Create Mock Reports
    await Report.create({
      title: 'Daily Visit Report - 18th July',
      content: 'Visited 4 shops today. Registered New City Store, documents collected and uploaded.',
      reportType: 'Daily Report',
      createdBy: pincodeUser._id,
      assignedTo: districtUser._id,
      status: 'Pending',
    });

    await Report.create({
      title: 'District Activity Summary',
      content: 'Overview of all pincode registrations for the week. Compliance rates are stable.',
      reportType: 'Activity Report',
      createdBy: districtUser._id,
      assignedTo: divisionalUser._id,
      status: 'Reviewed',
    });

    // 8. Create Activity Logs
    await ActivityLog.create({
      user: pincodeUser._id,
      action: 'Register Shop',
      description: 'Registered Murugan Stores',
    });
    await ActivityLog.create({
      user: pincodeUser._id,
      action: 'Register Shop',
      description: 'Registered New City Store',
    });
    await ActivityLog.create({
      user: districtUser._id,
      action: 'Verify Shop',
      description: 'Verified Murugan Stores',
    });
    await ActivityLog.create({
      user: stateUser._id,
      action: 'Create Agent',
      description: 'Created Divisional Agent: Chennai Division Agent',
    });

    // 9. Create Notification
    await Notification.create({
      recipient: districtUser._id,
      sender: pincodeUser._id,
      message: 'New shop registration submitted: New City Store in pincode 641001',
    });

    console.log('Database auto-seeding successfully finished!');
  } catch (error) {
    console.error('Error during auto-seeding:', error);
  }
};
