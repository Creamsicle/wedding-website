import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The secret password constant is no longer needed here
// const PASSWORD = 'artgallery';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to the login page itself and public assets/API routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/images') || // Assuming your images are in /public/images
    pathname.startsWith('/api') || // Allow API routes
    pathname.startsWith('/_next') || // Next.js internals
    pathname.includes('.') // Likely a static file (e.g., favicon.ico)
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get('sitePasswordProtected')?.value === 'true';

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    const loginUrl = new URL('/login', request.url);
    // Optionally, you can add a query parameter to redirect back after login
    // loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login page itself
     * - images folder (if your images are served from /public/images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|images).*)',
  ],
}; 