import express from 'express';
import { registerShop, getShops, verifyShop } from '../controllers/shopController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getShops);
router.post('/', protect, checkRole('Pincode Agent'), upload.single('document'), registerShop);
router.patch('/:id/verify', protect, checkRole('Admin', 'State Agent', 'Divisional Agent', 'District Agent'), verifyShop);

export default router;
