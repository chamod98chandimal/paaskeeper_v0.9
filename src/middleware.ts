import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('paaskeeper_token')?.value;

  const isProtectedRoute = req.nextUrl.pathname.startsWith('/vault');

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/vault'],
};
