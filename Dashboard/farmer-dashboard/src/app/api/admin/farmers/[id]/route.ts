import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Farmer from '@/models/Farmer';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminSession = cookies().get('adminSession');
    
    if (!adminSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const deletedFarmer = await Farmer.findByIdAndDelete(id);

    if (!deletedFarmer) {
      return NextResponse.json(
        { error: 'Farmer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting farmer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 