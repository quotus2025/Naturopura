import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';
import { isAdmin } from '../middleware/roleCheck';

const router = express.Router();

// Protect all dashboard routes
router.use(authenticateToken);
router.use(isAdmin);

router.get('/stats', getDashboardStats);

export default router;