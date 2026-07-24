import express from 'express';
import { getDashboardMetrics, resetDashboardDatabase } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/metrics', protect, getDashboardMetrics);
router.post('/reset-db', protect, resetDashboardDatabase);

export default router;
