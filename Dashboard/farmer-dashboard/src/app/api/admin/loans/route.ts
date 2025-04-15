import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Loan from '@/models/Loan';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminToken = await cookieStore.get('adminSession');

    if (!adminToken) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(adminToken.value, JWT_SECRET) as {
      role: string;
    };

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    await connectDB();

    const loans = await Loan.find()
      .populate({
        path: 'farmerId', // Changed from userId to farmerId
        model: 'Farmer',
        select: 'name email farmName _id'
      })
      .lean();

    console.log('Raw loan data:', JSON.stringify(loans[0], null, 2));

    const transformedLoans = loans.map(loan => {
      // Use farmerId instead of userId
      const userId = loan.farmerId && typeof loan.farmerId === 'object' 
        ? loan.farmerId._id.toString() 
        : typeof loan.farmerId === 'string' 
          ? loan.farmerId 
          : '';

      console.log('Loan transformation:', {
        originalFarmerId: loan.farmerId,
        extractedUserId: userId,
        isObject: typeof loan.farmerId === 'object',
        hasId: loan.farmerId?._id !== undefined
      });

      return {
        _id: loan._id.toString(),
        userId: userId, // Keep as userId for frontend compatibility
        amount: loan.amount,
        status: loan.status,
        applicationDate: loan.applicationDate,
        farmer: loan.farmerId && typeof loan.farmerId === 'object' ? {
          name: loan.farmerId.name,
          email: loan.farmerId.email,
          farmName: loan.farmerId.farmName
        } : null
      };
    });

    return NextResponse.json(transformedLoans);
  } catch (error) {
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}