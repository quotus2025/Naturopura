import { Request, Response } from 'express';

interface PaymentRequest extends Request {
  body: {
    amount: number;
    productId: string;
    paymentStatus: 'success' | 'failed';
  }
}

export const processTestPayment = async (req: PaymentRequest, res: Response) => {
  try {
    const { amount, productId, paymentStatus } = req.body;

    // Validate required fields
    if (!amount || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and productId are required'
      });
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (paymentStatus === 'failed') {
      return res.status(400).json({
        success: false,
        message: 'Payment failed (Test Mode)',
        testMode: true
      });
    }

    // Create payment record in database
    const payment = {
      amount,
      productId,
      userId: req.user.id, // From auth middleware
      status: 'completed',
      testMode: true,
      createdAt: new Date()
    };

    // In real implementation, save payment to database here
    console.log('Test payment processed:', payment);

    return res.status(200).json({
      success: true,
      message: 'Test payment processed successfully',
      payment,
      testMode: true
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing payment',
      testMode: true
    });
  }
};