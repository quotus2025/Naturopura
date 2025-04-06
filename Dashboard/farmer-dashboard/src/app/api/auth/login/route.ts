import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Farmer from '@/models/Farmer';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_EMAIL = 'admin@naturopura.com';
const ADMIN_PASSWORD = 'Admin@1234';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // First check if it's an admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { 
          email: ADMIN_EMAIL, 
          name: 'Administrator',
          role: 'admin' 
        },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      const response = NextResponse.json(
        { 
          message: 'Admin login successful', 
          role: 'admin',
          user: {
            name: 'Administrator',
            email: ADMIN_EMAIL,
            role: 'admin'
          }
        },
        { status: 200 }
      );

      response.cookies.set('adminSession', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return response;
    }

    // Connect to MongoDB
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }
    
    // Find farmer by email
    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, farmer.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create farmer token
    const token = jwt.sign(
      { 
        userId: farmer._id, 
        email: farmer.email, 
        name: farmer.name,
        role: 'farmer' 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json(
      { 
        message: 'Login successful', 
        role: 'farmer', 
        user: { 
          name: farmer.name, 
          email: farmer.email, 
          farmName: farmer.farmName, 
          location: farmer.location,
          role: 'farmer'
        } 
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('adminSession');
    const userToken = cookieStore.get('token');

    if (!adminToken && !userToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const token = adminToken || userToken;
    
    try {
      const decoded = jwt.verify(token!.value, JWT_SECRET) as {
        userId?: string;
        email: string;
        name: string;
        role: string;
        farmName?: string;
        location?: string;
      };

      // Return different user data based on role
      if (decoded.role === 'admin') {
        return NextResponse.json({
          name: decoded.name,
          email: decoded.email,
          role: decoded.role
        });
      } else {
        return NextResponse.json({
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          farmName: decoded.farmName,
          location: decoded.location,
          userId: decoded.userId
        });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}