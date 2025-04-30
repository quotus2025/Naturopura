import express from 'express';
import { loginUser, registerUser, validateToken,getFarmers } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();



router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/validate', authenticateToken, validateToken);
router.get('/farmers', authenticateToken, getFarmers);

export default router;
