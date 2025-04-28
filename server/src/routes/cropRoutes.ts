import express from 'express';
import multer from 'multer';
import { detectCropHealth } from '../controllers/cropController';

// Create an express router
const router = express.Router();

// Set up multer storage configuration (in-memory storage as an example)
const storage = multer.memoryStorage();  // File will be stored in memory, you can change this to diskStorage if needed

// Create an upload middleware
const upload = multer({ storage });

// Define the POST route for crop health detection
router.post('/detect', upload.single('image'), detectCropHealth);

export default router;
