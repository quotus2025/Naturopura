import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const KINDWISE_API_KEY = '8u0fQ2fLw6C6gm3wSnAgEm9yymJwESXiQDIQbQjEYLPyEkeAKo';
const KINDWISE_API_URL = 'https://crop.kindwise.com/api/v1'; // Updated endpoint

export async function POST(request: Request) {
  try {
    // Auth check
    const cookieStore = cookies();
    const token = await cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }

    // Get and validate image
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Call Kindwise API
    try {
      console.log('Calling Kindwise API...');
      const apiResponse = await fetch(KINDWISE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KINDWISE_API_KEY}` // Updated auth header
        },
        body: JSON.stringify({
          images: [base64Image], // Updated request format
          disease_details: true,
          classification: true
        })
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.text();
        console.error('Kindwise API error:', errorData);
        return NextResponse.json(
          { error: 'Kindwise API failed', details: errorData },
          { status: apiResponse.status }
        );
      }

      const data = await apiResponse.json();
      
      // Transform Kindwise API response to match our interface
      if (data.result && data.result.length > 0) {
        const identification = data.result[0];
        return NextResponse.json({
          result: [{
            disease_name: identification.disease || 'Unknown Disease',
            confidence: identification.probability || 0,
            details: {
              description: identification.description || '',
              treatment: identification.treatment?.join('. ') || '',
              causes: identification.causes || []
            }
          }]
        });
      } else {
        return NextResponse.json({
          result: [{
            disease_name: 'No Disease Detected',
            confidence: 0,
            details: {
              description: 'The plant appears to be healthy',
              treatment: '',
              causes: []
            }
          }]
        });
      }

    } catch (apiError) {
      console.error('Kindwise API error:', apiError);
      return NextResponse.json(
        { error: 'Failed to communicate with Kindwise API' },
        { status: 502 }
      );
    }

  } catch (error) {
    console.error('Crop health detection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
