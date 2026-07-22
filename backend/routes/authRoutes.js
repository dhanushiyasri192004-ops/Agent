import express from 'express';
import { loginUser, forgotPassword, registerUser, clearAllData } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.get('/clear-all-data', clearAllData);
router.post('/clear-all-data', clearAllData);

export default router;
