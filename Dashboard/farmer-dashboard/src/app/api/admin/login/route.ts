import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Default admin credentials
const ADMIN_EMAIL = 'admin@naturopura.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_NAME = 'Tusar Mohapatra';  // This is the correct name

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

    // Verify password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const userData = {
      id: 'admin',
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: 'admin'
    };

    // Create admin token with name included
    const token = jwt.sign(
      userData,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({
      message: 'Login successful',
      user: userData  // Use the userData object directly
    });

    // Set the cookie
    response.cookies.set('adminSession', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Error logging in' },
      { status: 500 }
    );
  }
}