import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Farmer from '@/models/Farmer';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Connect to database
    await connectDB();

    // Find farmer
    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create token
    const token = jwt.sign(
      { id: farmer._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      token,
      farmer: {
        id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        farmName: farmer.farmName,
        location: farmer.location
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error logging in' },
      { status: 500 }
    );
  }
} 