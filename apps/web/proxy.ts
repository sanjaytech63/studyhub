import { AUTH_COOKIE_NAME } from '@/lib/auth/auth.constants';
import { NextResponse, type NextRequest } from 'next/server';

const AUTH_ROUTES = [
  '/login',
  '/register',
  '/verify-otp',
  '/forgot-password',
  '/reset-password',
] as const;

const PROTECTED_ROUTES = [
  '/dashboard',
  '/learning',
  '/profile',
  '/notifications',
  '/settings',
  '/checkout',
] as const;

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some((route) => matchesRoute(pathname, route));
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((route) => matchesRoute(pathname, route));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isAuthenticated = Boolean(authCookie);

  // Protect private pages.
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = '/login';
    loginUrl.search = '';

    loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  // Prevent authenticated users from visiting auth pages.
  if (isAuthRoute(pathname) && isAuthenticated) {
    const dashboardUrl = request.nextUrl.clone();

    dashboardUrl.pathname = '/dashboard';
    dashboardUrl.search = '';

    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
