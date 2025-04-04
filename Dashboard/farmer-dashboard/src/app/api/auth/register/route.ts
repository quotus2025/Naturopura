import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Farmer from '@/models/Farmer';

export async function POST(request: Request) {
  try {
    const { name, email, password, farmName, location } = await request.json();

    // Connect to database
    await connectDB();

    // Check if farmer already exists
    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer) {
      return NextResponse.json(
        { error: 'Farmer already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new farmer
    const farmer = await Farmer.create({
      name,
      email,
      password: hashedPassword,
      farmName,
      location,
    });

    return NextResponse.json(
      { message: 'Farmer registered successfully', farmer: { 
        id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        farmName: farmer.farmName,
        location: farmer.location
      }},
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error registering farmer' },
      { status: 500 }
    );
  }
} 