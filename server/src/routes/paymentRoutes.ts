import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { processTestPayment, processCryptoPurchase } from '../controllers/paymentController';

const router = express.Router();

// Test payment route
router.post('/test-payment', authenticateToken, processTestPayment);

// Crypto purchase route
router.post('/purchase', authenticateToken, processCryptoPurchase);

export default router;