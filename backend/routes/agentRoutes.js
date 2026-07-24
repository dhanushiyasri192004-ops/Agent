import express from 'express';
import { createAgent, getMySubAgents, toggleAgentStatus, updateAgent, deleteAgent } from '../controllers/agentController.js';
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

router.patch(
  '/:id',
  protect,
  checkRole('Admin', 'State Agent', 'Divisional Agent', 'District Agent'),
  updateAgent
);

router.delete(
  '/:id',
  protect,
  checkRole('Admin', 'State Agent', 'Divisional Agent', 'District Agent'),
  deleteAgent
);

export default router;
