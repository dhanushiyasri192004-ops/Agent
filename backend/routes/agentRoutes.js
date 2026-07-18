import express from 'express';
import { createAgent, getMySubAgents, toggleAgentStatus } from '../controllers/agentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post(
  '/',
  protect,
  checkRole('Admin', 'State Agent', 'Divisional Agent', 'District Agent'),
  createAgent
);

router.get(
  '/',
  protect,
  checkRole('Admin', 'State Agent', 'Divisional Agent', 'District Agent'),
  getMySubAgents
);

router.patch(
  '/:id/status',
  protect,
  checkRole('Admin', 'State Agent', 'Divisional Agent', 'District Agent'),
  toggleAgentStatus
);

export default router;
