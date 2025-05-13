import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Fixed credentials for admin access
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !isValidAuth(authHeader)) {
      return new NextResponse(null, {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Access Required"'
        }
      });
    }
  }

  return NextResponse.next();
}

function isValidAuth(authHeader: string): boolean {
  try {
    const [scheme, encoded] = authHeader.split(' ');

    if (!scheme || !encoded || scheme.toLowerCase() !== 'basic') {
      return false;
    }

    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');

    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  } catch {
    return false;
  }
}

export const config = {
  matcher: '/admin/:path*'
}; 