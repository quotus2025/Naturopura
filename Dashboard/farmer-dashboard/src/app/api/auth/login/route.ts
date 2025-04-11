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
    
    // Connect to MongoDB
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }
    
    // Find user by email
    const user = await Farmer.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if this is the admin user
    const isAdmin = user.email === 'admin@naturopura.com';
    
    // Create token with proper role
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        name: user.name,
        role: isAdmin ? 'admin' : 'farmer',
        farmName: user.farmName,
        location: user.location
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json(
      { 
        message: 'Login successful',
        role: isAdmin ? 'admin' : 'farmer',
        user: { 
          name: user.name,
          email: user.email,
          farmName: user.farmName,
          location: user.location,
          role: isAdmin ? 'admin' : 'farmer'
        } 
      },
      { status: 200 }
    );

    // Set the appropriate cookie
    const cookieName = isAdmin ? 'adminSession' : 'token';
    response.cookies.set(cookieName, token, {
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