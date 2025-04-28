import express from 'express';
import { verifyEkyc, getEkycStatus } from '../controllers/ekycController';
import { authenticateToken } from '../middleware/auth';
import { handleEkycUpload } from '../middleware/upload';

const router = express.Router();

router.post('/verify',
  authenticateToken,
  (req, res, next) => {
    handleEkycUpload(req, res, next);
  },
  verifyEkyc
);

router.get('/status', 
  authenticateToken, 
  getEkycStatus
);

export default router;