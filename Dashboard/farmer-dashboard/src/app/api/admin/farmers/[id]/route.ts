import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Farmer from '@/models/Farmer';
import Loan from '@/models/Loan';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Delete all loans associated with the farmer
    await Loan.deleteMany({ farmerId: params.id });

    // Delete the farmer
    const result = await Farmer.findByIdAndDelete(params.id);

    if (!result) {
      return NextResponse.json(
        { error: 'Farmer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Farmer deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting farmer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}