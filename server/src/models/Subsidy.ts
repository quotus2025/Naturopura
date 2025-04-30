// models/Subsidy.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubsidy extends Document {
  farmerId: mongoose.Types.ObjectId;
  cropType: string;
  landSize: number;
  amountRequested: number;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: Date;
}

const SubsidySchema: Schema = new Schema({
  farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cropType: { type: String, required: true },
  landSize: { type: Number, required: true },
  amountRequested: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISubsidy>('Subsidy', SubsidySchema);
