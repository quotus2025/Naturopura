import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  farmerId: { // Changed from userId to farmerId
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  tenure: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  interestRate: {
    type: Number,
    required: true
  },
  documents: [{
    type: String
  }],
  applicationDate: {
    type: Date,
    default: Date.now
  }
});

loanSchema.index({ farmerId: 1 });

const Loan = mongoose.models.Loan || mongoose.model('Loan', loanSchema);
export default Loan;