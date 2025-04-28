import express from 'express';
import {
  createLoan,
  getAllLoans,
  getFarmerLoans,
  getLoanById,
  updateLoanStatus,
  getLoanStats
} from '../controllers/loanController';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validators
const loanValidator = [
  body('amount')
    .isNumeric().withMessage('Amount must be a number')
    .isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  
  body('purpose')
    .isIn(['seeds', 'equipment', 'irrigation', 'land', 'other'])
    .withMessage('Invalid purpose value'),
  
  body('term')
    .isIn(['3months', '6months', '1year', '2years', '5years'])
    .withMessage('Invalid term value'),
  
  body('collateral')
    .notEmpty().withMessage('Collateral is required')
    .isString().withMessage('Collateral must be text'),
  
  body('cropType')
    .notEmpty().withMessage('Crop type is required')
    .isString().withMessage('Crop type must be text'),
  
  body('landSize')
    .optional()
    .isFloat({ min: 0 }).withMessage('Land size must be a positive number'),
  
  body('farmDetails')
    .optional()
    .isString().withMessage('Farm details must be text')
];

const statusValidator = [
  body('status')
    .isIn(['pending', 'approved', 'rejected', 'completed'])
    .withMessage('Invalid status value'),
];

// Middleware to check if user is admin
const isAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Middleware to check if user is farmer
const isFarmer = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.user?.role !== 'farmer') {
    return res.status(403).json({ message: 'Access denied. Farmer only.' });
  }
  next();
};

// Routes
router.post('/', authenticateToken, isFarmer, loanValidator, createLoan);
router.get('/', authenticateToken, isAdmin, getAllLoans);
router.get('/farmer', authenticateToken, isFarmer, getFarmerLoans);
router.get('/stats', authenticateToken, isAdmin, getLoanStats);
router.get('/:id', authenticateToken, getLoanById);
router.put('/:id/status', authenticateToken, isAdmin, statusValidator, updateLoanStatus);

export default router;
