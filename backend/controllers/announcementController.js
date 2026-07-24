import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (req, res, next) => {
  const { title, desc, target, isPinned, status } = req.body;
  try {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('en-US', { month: 'short' })} ${today.getFullYear()}`;

    const announcement = await Announcement.create({
      title,
      desc,
      target,
      isPinned,
      status,
      date: formattedDate,
    });

    // Create notifications for all users
    const users = await User.find({});
    const notifications = users.map(u => ({
      recipient: u._id,
      sender: req.user._id,
      message: `New Announcement: ${title} - ${desc}`,
      isRead: false
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
};
