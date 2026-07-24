import express from 'express';
import { getMyCommissions, getAdminCommissionStats, requestPayout } from '../controllers/commissionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, getMyCommissions);
router.get('/admin-stats', protect, getAdminCommissionStats);
router.post('/payout', protect, requestPayout);

export default router;
