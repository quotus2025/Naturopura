import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminToken = await cookieStore.get('adminSession');
    const userToken = await cookieStore.get('token');

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

      if (decoded.role === 'admin') {
        return NextResponse.json({
          id: decoded.userId || 'admin',
          name: decoded.name || 'Administrator',
          email: decoded.email,
          role: decoded.role
        });
      }

      return NextResponse.json({
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        farmName: decoded.farmName,
        location: decoded.location
      });
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