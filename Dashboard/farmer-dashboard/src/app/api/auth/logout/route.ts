import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );

  // Clear all cookies
  response.cookies.delete('token');
  response.cookies.delete('adminSession');
  
  // Clear cookies with different paths
  response.cookies.delete('token', { path: '/' });
  response.cookies.delete('adminSession', { path: '/' });
  response.cookies.delete('token', { path: '/admin' });
  response.cookies.delete('adminSession', { path: '/admin' });

  return response;
} 