import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  farmerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  images: [{ type: String }], // Array of image paths
  status: { 
    type: String, 
    enum: ['available', 'out_of_stock'], 
    default: 'available' 
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);