import { Request, Response } from 'express';
import Product from '../models/Product';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

interface RequestWithFiles extends Request {
  files: Express.Multer.File[];
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate('farmerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products'
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmerId', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json(product);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product'
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    // Type assertion for files
    const files = (req as RequestWithFiles).files;
    
    console.log('Raw request files:', files);
    console.log('Form data received:', req.body);
    console.log('User data:', req.user); // Add this log

    // Check if user exists and has an ID
    if (!req.user?.id) {
      throw new Error('User not authenticated or missing ID');
    }

    // Ensure files array exists
    if (!files || !Array.isArray(files)) {
      console.warn('No files received or invalid files format');
    }

    // Create image paths from uploaded files
    const imagePaths = files && Array.isArray(files)
      ? files.map(file => `/uploads/products/${file.filename}`)
      : [];

    console.log('Generated image paths:', imagePaths);

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      unit: req.body.unit,
      farmerId: req.user.id, // Changed from req.user?._id to req.user.id
      images: imagePaths,
      status: 'available'
    });

    console.log('Created product:', product);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error: any) {
    console.error('Product creation error:', {
      error: error.message,
      stack: error.stack,
      user: req.user // Add user info to error log
    });
    
    // Delete uploaded files if product creation fails
    if (files && Array.isArray(files)) {
      files.forEach(file => {
        const filePath = path.join(__dirname, '../../uploads/products', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error creating product'
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is the owner
    if (product.farmerId.toString() !== req.user?._id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('farmerId', 'name email');

    res.status(200).json(updatedProduct);
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating product'
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is the owner
    if (product.farmerId.toString() !== req.user?._id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    // Delete associated images
    for (const imagePath of product.images) {
      const fullPath = path.join(__dirname, '../../uploads/products', path.basename(imagePath));
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting product'
    });
  }
};

interface PricePredictionResponse {
  title: string;
  price: string;
  source: string;
}

export const predictPrice = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    // Validate query parameter
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid query parameter is required'
      });
    }

    // Log request for debugging
    console.log('Price prediction request:', {
      query: q,
      timestamp: new Date().toISOString()
    });

    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google_shopping',
        q: q,
        gl: 'in',
        hl: 'en',
        api_key: process.env.SERP_API_KEY,
        num: 5
      }
    });

    // Validate API response
    if (!response.data?.shopping_results) {
      throw new Error('Invalid response from price API');
    }

    const predictions = response.data.shopping_results
      .filter((item: any) => item.price && typeof item.price === 'string')
      .map((item: any) => ({
        title: item.title || 'Unknown Product',
        price: item.price.replace(/[^0-9,.]/g, ''),
        source: item.source || 'Unknown Source'
      }))
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      predictions,
      query: q
    });

  } catch (error: any) {
    console.error('Price prediction error:', {
      message: error.message,
      query: req.query.q,
      response: error.response?.data
    });

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch price predictions',
      error: error.message
    });
  }
};