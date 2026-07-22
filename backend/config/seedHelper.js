import User from '../models/User.js';
import Agent from '../models/Agent.js';
import Shop from '../models/Shop.js';
import Report from '../models/Report.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';

export const seedIfEmpty = async () => {
  try {
    await User.deleteMany({});
    await Agent.deleteMany({});
    await Shop.deleteMany({});
    await Report.deleteMany({});
    await Notification.deleteMany({});
    await ActivityLog.deleteMany({});
    console.log('Successfully wiped all mock agents and data. Operating with clean database only.');
  } catch (err) {
    console.error('Error clearing database collections:', err);
  }
};
