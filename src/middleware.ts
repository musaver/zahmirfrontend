import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of paths that require authentication
const protectedPaths = [
  '/checkout',
  '/orders',
  '/order-confirmation',
  '/my-account',
  '/my-account-orders',
  '/my-account-address',
  '/my-account-edit',
  '/my-account-orders-details',
  '/my-account-wishlist'
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath && !token) {
    // Redirect to login page with return URL
    const returnUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/login-register?redirect=${returnUrl}`, request.url)
    );
  }

  return NextResponse.next();
}

// Configure paths that trigger middleware
export const config = {
  matcher: [
    '/checkout',
    '/orders/:path*',
    '/order-confirmation/:path*',
    '/my-account/:path*',
  ]
}; 