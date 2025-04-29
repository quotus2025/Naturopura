import { Request, Response } from 'express';
import { ethers } from 'ethers';

interface TestPaymentRequest extends Request {
  body: {
    amount: number;
    productId: string;
    status: 'success' | 'failed';
  }
}

// Add the missing processTestPayment export
export const processTestPayment = async (req: TestPaymentRequest, res: Response) => {
  try {
    const { amount, productId, status } = req.body;

    // Validate input
    if (!amount || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and productId are required'
      });
    }

    // Create test payment record
    const payment = {
      amount,
      productId,
      userId: req.user?.id,
      status,
      createdAt: new Date()
    };

    // Log for debugging
    console.log('Test payment:', payment);

    return res.status(200).json({
      success: true,
      message: `Test payment ${status} processed`,
      data: payment
    });
  } catch (error: any) {
    console.error('Test payment error:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });

    return res.status(500).json({
      success: false,
      message: 'Error processing test payment',
      error: error.message
    });
  }
};

interface CryptoPurchaseRequest extends Request {
  body: {
    productId: string;
    amount: number;
    txHash: string;
    paymentMethod: 'crypto';
  }
}

export const processCryptoPurchase = async (req: CryptoPurchaseRequest, res: Response) => {
  try {
    const { productId, amount, txHash } = req.body;

    // Validate input
    if (!productId || !amount || !txHash) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Verify transaction
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    if (!provider) {
      throw new Error('Failed to initialize blockchain provider');
    }

    const transaction = await provider.getTransaction(txHash);
    if (!transaction) {
      return res.status(400).json({
        success: false,
        message: 'Transaction not found on blockchain'
      });
    }

    // Create purchase record
    const purchase = {
      productId,
      amount,
      userId: req.user?.id,
      txHash,
      paymentMethod: 'crypto',
      status: 'completed',
      createdAt: new Date()
    };

    // Log for debugging
    console.log('Processing purchase:', {
      purchase,
      user: req.user,
      txDetails: transaction
    });

    return res.status(200).json({
      success: true,
      message: 'Purchase processed successfully',
      data: purchase
    });

  } catch (error: any) {
    console.error('Purchase processing error:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });

    return res.status(500).json({
      success: false,
      message: 'Error processing purchase',
      error: error.message
    });
  }
};