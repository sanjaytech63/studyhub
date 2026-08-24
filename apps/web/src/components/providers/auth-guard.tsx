'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { PageLoader } from '../feedback/page-loader';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/learning',
  '/profile',
  '/notifications',
  '/settings',
  '/checkout',
];

const AUTH_ROUTES = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password'];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some((route) => matchesRoute(pathname, route));
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((route) => matchesRoute(pathname, route));
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const isInitialized = useAuthStore((state) => state.isInitialized);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (isProtectedRoute(pathname) && !isAuthenticated) {
      const callbackUrl = encodeURIComponent(`${pathname}${window.location.search}`);

      router.replace(`/login?callbackUrl=${callbackUrl}`);

      return;
    }

    if (isAuthRoute(pathname) && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isInitialized, isAuthenticated, pathname, router]);

  if (!isInitialized) {
    return <PageLoader />;
  }

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    return null;
  }

  return children;
}
