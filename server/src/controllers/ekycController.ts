import { Request, Response } from 'express';
import User from '../models/User';
import path from 'path';

export const verifyEkyc = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const userId = req.user!.id;

    if (!files.aadhar || !files.pan || !files.selfie) {
      return res.status(400).json({
        success: false,
        message: 'All required documents must be provided'
      });
    }

    // Store relative paths instead of absolute paths
    const documents = {
      aadhar: path.relative(path.join(__dirname, '../../'), files.aadhar[0].path),
      pan: path.relative(path.join(__dirname, '../../'), files.pan[0].path),
      selfie: path.relative(path.join(__dirname, '../../'), files.selfie[0].path)
    };

    await User.findByIdAndUpdate(userId, {
      'kyc.status': 'verified',
      'kyc.documents': documents,
      'kyc.verifiedAt': new Date()
    });

    res.status(200).json({
      success: true,
      message: 'eKYC verification completed successfully',
      documents: documents
    });
  } catch (error) {
    console.error('eKYC verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process eKYC verification'
    });
  }
};

export const getEkycStatus = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select('kyc');
    res.status(200).json({
      success: true,
      data: user?.kyc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch eKYC status'
    });
  }
};