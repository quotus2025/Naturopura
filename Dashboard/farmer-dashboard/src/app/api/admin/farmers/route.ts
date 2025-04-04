import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Farmer from '@/models/Farmer';

export async function GET() {
  try {
    const adminSession = cookies().get('adminSession');
    
    if (!adminSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const farmers = await Farmer.find({}, { password: 0 });
    return NextResponse.json(farmers);
  } catch (error) {
    console.error('Error fetching farmers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 