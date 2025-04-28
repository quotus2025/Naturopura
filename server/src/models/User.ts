import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'farmer'], required: true },
    phoneNumber: String,
    address: String,
    farmSize: Number,
    cropTypes: [String],
    location: {
        latitude: Number,
        longitude: Number
    },
    isDefaultAdmin: { type: Boolean, default: false },
    kyc: {
        status: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending'
        },
        documents: {
            aadhar: String,
            pan: String,
            selfie: String
        },
        verifiedAt: Date,
        remarks: String
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);