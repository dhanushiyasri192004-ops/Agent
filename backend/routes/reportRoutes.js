import express from 'express';
import { submitReport, getMyReports, updateReportStatus } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyReports);
router.post('/', protect, upload.single('document'), submitReport);
router.patch('/:id/status', protect, updateReportStatus);

export default router;
