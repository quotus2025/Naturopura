import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Default admin credentials
const ADMIN_EMAIL = 'admin@naturopura.com';
const ADMIN_PASSWORD = 'Admin@1234';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Check if it's the admin email
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In production, you would verify against a hashed password from the database
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create admin token
    const token = jwt.sign(
      { id: 'admin', role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      token,
      admin: {
        id: 'admin',
        email: ADMIN_EMAIL,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Error logging in' },
      { status: 500 }
    );
  }
} 