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
      .populate('farmerId', 'name email farmName')
      .sort({ applicationDate: -1 });

    return NextResponse.json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}