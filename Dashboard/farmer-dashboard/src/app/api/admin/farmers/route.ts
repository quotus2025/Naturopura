import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Farmer from '@/models/Farmer';

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

    const farmers = await Farmer.find({}).lean();  // Using lean() for better performance
    
    if (!Array.isArray(farmers)) {
      return NextResponse.json({ farmers: [] });
    }

    return NextResponse.json({ 
      farmers: farmers.map(farmer => ({
        ...farmer,
        id: farmer._id.toString()  // Ensure ID is properly serialized
      }))
    });

  } catch (error) {
    console.error('Error fetching farmers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}