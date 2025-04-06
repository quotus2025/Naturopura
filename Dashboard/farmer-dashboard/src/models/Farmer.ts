import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  farmName: {
    type: String,
    required: [true, 'Please provide your farm name'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please provide your location'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['farmer', 'admin'],
    default: 'farmer',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model if it doesn't exist, otherwise use the existing one
const Farmer = mongoose.models.Farmer || mongoose.model('Farmer', farmerSchema);

export default Farmer; 