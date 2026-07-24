import express from 'express';
import { getAnnouncements, createAnnouncement } from '../controllers/announcementController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAnnouncements);
router.post('/', protect, createAnnouncement);

export default router;
