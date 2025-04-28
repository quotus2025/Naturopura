import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { handleProductUpload } from '../middleware/upload';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes - with error handling
router.post('/', 
  (req, res, next) => {
    console.log('Request body:', req.body);
    next();
  },
  authenticateToken,
  handleProductUpload,
  createProduct
);

router.put('/:id',
  authenticateToken,
  handleProductUpload,
  updateProduct
);

router.delete('/:id',
  authenticateToken,
  deleteProduct
);

export default router;
