import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      default: 'All Agents',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'Active',
    },
    date: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
