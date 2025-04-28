import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for Loan document
export interface ILoan extends Document {
  farmer: mongoose.Types.ObjectId;
  amount: number;
  purpose: 'seeds' | 'equipment' | 'irrigation' | 'land' | 'other';
  term: '3months' | '6months' | '1year' | '2years' | '5years';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  collateral?: string;
  cropType?: string;
  landSize?: number;
  farmDetails?: string;
  appliedDate: Date;
  approvedDate?: Date;
  rejectedDate?: Date;
  rejectionReason?: string;
  completedDate?: Date;
  interestRate: number;
}

// Create the Loan schema
const LoanSchema = new Schema<ILoan>({
  farmer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  purpose: {
    type: String,
    required: true,
    enum: ['seeds', 'equipment', 'irrigation', 'land', 'other']
  },
  term: {
    type: String,
    required: true,
    enum: ['3months', '6months', '1year', '2years', '5years']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  collateral: {
    type: String
  },
  cropType: {
    type: String
  },
  landSize: {
    type: Number
  },
  farmDetails: {
    type: String
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  approvedDate: {
    type: Date
  },
  rejectedDate: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  completedDate: {
    type: Date
  },
  interestRate: {
    type: Number,
    default: 5 // Default interest rate of 5%
  }
});

// Create and export the Loan model
export default mongoose.model<ILoan>('Loan', LoanSchema);