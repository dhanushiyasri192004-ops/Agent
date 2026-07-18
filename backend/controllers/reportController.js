import Report from '../models/Report.js';
import Agent from '../models/Agent.js';
import ActivityLog from '../models/ActivityLog.js';
import Notification from '../models/Notification.js';

export const submitReport = async (req, res, next) => {
  const { title, content, reportType } = req.body;

  try {
    let assignedTo = null;

    if (req.user.role === 'Admin') {
      assignedTo = req.user._id;
    } else {
      const agentProfile = await Agent.findOne({ user: req.user._id });
      if (!agentProfile) {
        res.status(404);
        throw new Error('Agent profile not found');
      }

      if (agentProfile.parent) {
        assignedTo = agentProfile.parent;
      } else {
        assignedTo = req.user._id;
      }
    }

    const documentUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const report = await Report.create({
      title,
      content,
      reportType,
      createdBy: req.user._id,
      assignedTo,
      documentUrl,
    });

    if (assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: assignedTo,
        sender: req.user._id,
        message: `New ${reportType} submitted by ${req.user.email}: "${title}"`,
      });
    }

    await ActivityLog.create({
      user: req.user._id,
      action: 'Submit Report',
      description: `Submitted a ${reportType}: ${title}`,
    });

    res.status(201).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({
      $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
    })
      .populate('createdBy', 'email role')
      .populate('assignedTo', 'email role')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const report = await Report.findById(id);
    if (!report) {
      res.status(404);
      throw new Error('Report not found');
    }

    if (report.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('Not authorized to update status on this report');
    }

    report.status = status;
    await report.save();

    await Notification.create({
      recipient: report.createdBy,
      sender: req.user._id,
      message: `Your report "${report.title}" status updated to ${status}`,
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'Update Report Status',
      description: `Report "${report.title}" status marked as ${status}`,
    });

    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};
