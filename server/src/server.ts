import connectDB from './config/db';
import cors from 'cors';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import userRoutes from './routes/userRoutes';
import loanRoutes from './routes/loanRoutes';
import cropRoutes from './routes/cropRoutes';
import productRoutes from './routes/productRoutes';
import paymentRoutes from './routes/paymentRoutes';
import createDefaultAdmin from './config/createDefaultAdmin';
import dashboardRoutes from './routes/dashboardRoutes';
import ekycRoutes from './routes/ekycRoutes';
import subsidyRoutes from './routes/subsidyRoutes'; // Import subsidy routes

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB().then(() => {
  createDefaultAdmin(); // Create default admin once DB is connected
});

// Enhanced CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-auth-token',
    'Accept',
    'X-Requested-With'
  ],
  exposedHeaders: ['Authorization', 'x-auth-token']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Middleware
app.use(express.json());

// Debug static file serving
const uploadsPath = path.join(__dirname, '..', 'uploads');
console.log('Configured uploads path:', uploadsPath);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads', 'products');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    console.log('Saving file:', uniqueName);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Enhanced static file serving with detailed logging
app.use('/uploads', (req, res, next) => {
  const fullPath = path.join(uploadsPath, req.url);
  console.log('Static file request:', {
    url: req.url,
    fullPath,
    exists: fs.existsSync(fullPath),
    isFile: fs.existsSync(fullPath) ? fs.statSync(fullPath).isFile() : false,
    timestamp: new Date().toISOString()
  });
  next();
});

app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    }
  }
}));

// Add a test endpoint to verify file existence
app.get('/api/check-file/:filename', (req, res) => {
  const filePath = path.join(uploadsPath, 'products', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.json({ exists: true, path: filePath });
  } else {
    res.json({ exists: false, path: filePath });
  }
});

// Debug endpoint to list all uploads
app.get('/api/debug/uploads', (req, res) => {
  try {
    const productsPath = path.join(uploadsPath, 'products');
    const files = fs.existsSync(productsPath) 
      ? fs.readdirSync(productsPath)
      : [];

    res.json({
      uploadsPath,
      productsPath,
      files: files.map(file => ({
        name: file,
        path: `/uploads/products/${file}`,
        fullPath: path.join(productsPath, file),
        size: fs.statSync(path.join(productsPath, file)).size,
        type: path.extname(file)
      }))
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/dashboard', dashboardRoutes); // Add this line
app.use('/api/ekyc', ekycRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/subsidy', subsidyRoutes); // Add this line

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});