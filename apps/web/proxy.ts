import { AUTH_COOKIE_NAME } from '@/lib/auth/auth.constants';
import { NextResponse, type NextRequest } from 'next/server';

const AUTH_ROUTES = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password'];

const PROTECTED_ROUTES = [
  '/dashboard',
  '/learning',
  '/profile',
  '/notifications',
  '/settings',
  '/checkout',
];

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => matchesRoute(pathname, route));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => matchesRoute(pathname, route));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const session = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isAuthenticated = Boolean(session);

  /*
   * --------------------------------------------------
   * Protected routes
   * --------------------------------------------------
   */

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = '/login';

    loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  /*
   * --------------------------------------------------
   * Auth routes
   * --------------------------------------------------
   *
   * Authenticated users should not see:
   *
   * /login
   * /register
   * /forgot-password
   * etc.
   */

  if (isAuthRoute(pathname) && isAuthenticated) {
    const dashboardUrl = request.nextUrl.clone();

    dashboardUrl.pathname = '/dashboard';

    dashboardUrl.search = '';

    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run Proxy for application routes,
     * excluding Next.js internals and static assets.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
