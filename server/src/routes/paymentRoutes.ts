import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { processTestPayment } from '../controllers/paymentController';

const router = express.Router();

// Test payment route
router.post('/test-payment', authenticateToken, processTestPayment);

export default router;