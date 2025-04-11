import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Farmer from '@/models/Farmer';
import Loan from '@/models/Loan';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const PLANT_AI_API_KEY = '8u0fQ2fLw6C6gm3wSnAgEm9yymJwESXiQDIQbQjEYLPyEkeAKo';

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

    try {
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

      // Get all farmers
      const farmers = await Farmer.find({ 
        role: { $ne: 'admin' } 
      }).select('-password');

      // Get loans for all farmers
      const loans = await Loan.find({
        farmerId: { $in: farmers.map(f => f._id) }
      });

      // Combine farmers with their loans
      const farmersWithLoans = farmers.map(farmer => ({
        ...farmer.toObject(),
        loans: loans.filter(loan => 
          loan.farmerId.toString() === farmer._id.toString()
        ).map(loan => ({
          id: loan._id,
          amount: loan.amount,
          status: loan.status,
          applicationDate: loan.applicationDate
        }))
      }));

      return NextResponse.json(farmersWithLoans);

    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error fetching farmers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }

    // Verify user token
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
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Call Plant.id API
    const response = await fetch('https://crop.kindwise.com/api/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PLANT_AI_API_KEY!
      },
      body: JSON.stringify({
        images: [base64Image],
        modifiers: ["crops_fast"],
        disease_details: ["cause", "common_names", "classification", "treatment"]
      })
    });

    const data = await response.json();

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Crop health detection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}