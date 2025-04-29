import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  predictPrice
} from '../controllers/productController';

const router = express.Router();

// Price prediction route (place this BEFORE the :id routes)
router.get('/predict-price', authenticateToken, predictPrice);

// Product CRUD routes
router.get('/', getProducts);
router.post('/', authenticateToken, createProduct);
router.get('/:id', getProductById);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

export default router;
