import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle logout route
  if (pathname === '/logout') {
    const response = NextResponse.redirect(new URL('/login', request.url));
    
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

  // Check for admin session
  const adminSession = request.cookies.get('adminSession');
  // Check for farmer session
  const farmerSession = request.cookies.get('token');

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register'];
  
  // If user is on a public path and has a valid session, redirect to appropriate dashboard
  if (publicPaths.includes(pathname)) {
    if (adminSession) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (farmerSession) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    if (!adminSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Handle protected farmer routes
  if (!publicPaths.includes(pathname) && !pathname.startsWith('/admin')) {
    if (!farmerSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 