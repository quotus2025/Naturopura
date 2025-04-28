import { Request, Response } from 'express';
import Loan from '../models/Loan';
import User from '../models/User';
import Product from '../models/Product';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get total farmers
    const totalFarmers = await User.countDocuments({ role: 'farmer' });

    // Get loan statistics
    const [totalLoans, loanStats] = await Promise.all([
      Loan.countDocuments(),
      Loan.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            pending: { 
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            approved: {
              $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
            },
            rejected: {
              $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    // Get total products
    const totalProducts = await Product.countDocuments();

    const stats = {
      totalFarmers,
      totalLoans,
      totalLoanAmount: loanStats[0]?.totalAmount || 0,
      totalProducts,
      pendingLoans: loanStats[0]?.pending || 0,
      approvedLoans: loanStats[0]?.approved || 0,
      rejectedLoans: loanStats[0]?.rejected || 0
    };

    res.status(200).json(stats);
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching dashboard statistics'
    });
  }
};