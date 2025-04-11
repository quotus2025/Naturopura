import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Loan from '@/models/Loan';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = await cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }

    // Verify token and get farmer ID
    const decoded = jwt.verify(token.value, JWT_SECRET) as {
      userId: string;
      role: string;
    };

    if (decoded.role !== 'farmer') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    
    // Create loan application
    await connectDB();
    const loan = new Loan({
      farmerId: decoded.userId,
      amount: formData.get('amount'),
      purpose: formData.get('purpose'),
      tenure: formData.get('tenure'),
      interestRate: 12, // Default interest rate
      status: 'pending'
    });

    await loan.save();

    return NextResponse.json({
      message: 'Loan application submitted successfully',
      loanId: loan._id
    });

  } catch (error) {
    console.error('Loan application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = await cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, JWT_SECRET) as {
      userId: string;
      role: string;
    };

    if (decoded.role !== 'farmer') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    await connectDB();

    const loans = await Loan.find({ 
      farmerId: decoded.userId 
    }).sort({ applicationDate: -1 });

    return NextResponse.json(loans);

  } catch (error) {
    console.error('Error fetching loans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}