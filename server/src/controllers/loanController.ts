import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Loan from '../models/Loan';
import User from '../models/User';

// Use the JwtPayload interface from auth middleware
interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

// @desc    Create a new loan application
// @route   POST /api/loans
// @access  Private (Farmer only)
export const createLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ 
      success: false, 
      message: 'Validation failed',
      errors: errors.array() 
    });
    return;
  }

  try {
    const {
      amount,
      purpose,
      term,
      collateral,
      cropType,
      landSize,
      farmDetails
    } = req.body;

    // Additional validation
    if (!amount || amount <= 0) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid loan amount' 
      });
      return;
    }

    if (!req.user?.userId) {
      res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
      return;
    }

    console.log('Creating loan with data:', { 
      amount, purpose, term, collateral, cropType, landSize, farmDetails,
      farmer: req.user.userId 
    });

    const loan = new Loan({
      farmer: req.user.userId,
      amount,
      purpose,
      term,
      collateral,
      cropType,
      landSize,
      farmDetails,
      status: 'pending',
      appliedDate: new Date()
    });

    const savedLoan = await loan.save();
    console.log('Loan saved successfully:', savedLoan);

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      data: savedLoan
    });
  } catch (err: any) {
    console.error('Error creating loan:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Error creating loan application',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// @desc    Get all loans (Admin only)
// @route   GET /api/loans
// @access  Private (Admin only)
export const getAllLoans = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loans = await Loan.find()
      .populate('farmer', 'name email')
      .sort({ appliedDate: -1 });

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get loans of the logged-in farmer
// @route   GET /api/loans/farmer
// @access  Private (Farmer only)
export const getFarmerLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loans = await Loan.find({ farmer: req.user?.userId }).sort({ appliedDate: -1 });

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single loan by ID (Admin or Owner Farmer)
// @route   GET /api/loans/:id
// @access  Private
export const getLoanById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('farmer', 'name email');

    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    // Check access rights
    const isOwner = loan.farmer && typeof loan.farmer === 'object'
      ? loan.farmer._id.toString() === req.user?.userId
      : false;

    if (req.user?.role !== 'admin' && !isOwner) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this loan'
      });
      return;
    }

    res.status(200).json({ success: true, data: loan });
  } catch (err: any) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update loan status (Admin only)
// @route   PUT /api/loans/:id/status
// @access  Private (Admin only)
export const updateLoanStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { status, rejectionReason } = req.body;

    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    loan.status = status;

    if (status === 'approved') {
      loan.approvedDate = new Date();
    } else if (status === 'rejected') {
      loan.rejectedDate = new Date();
      loan.rejectionReason = rejectionReason || 'Application rejected by admin';
    } else if (status === 'completed') {
      loan.completedDate = new Date();
    }

    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (err: any) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get loan statistics (Admin only)
// @route   GET /api/loans/stats
// @access  Private (Admin only)
export const getLoanStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalLoans = await Loan.countDocuments();
    const pendingLoans = await Loan.countDocuments({ status: 'pending' });
    const approvedLoans = await Loan.countDocuments({ status: 'approved' });
    const rejectedLoans = await Loan.countDocuments({ status: 'rejected' });
    const completedLoans = await Loan.countDocuments({ status: 'completed' });

    const approvedLoansList = await Loan.find({ status: 'approved' });
    const totalApprovedAmount = approvedLoansList.reduce((acc, loan) => acc + loan.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalLoans,
        pendingLoans,
        approvedLoans,
        rejectedLoans,
        completedLoans,
        totalApprovedAmount
      }
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
