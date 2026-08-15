export const AUTH_COOKIE_NAME = 'studyhub_session';

export const AUTH_ROUTES = [
  '/login',
  '/register',
  '/verify-otp',
  '/forgot-password',
  '/reset-password',
] as const;

export const PROTECTED_ROUTES = [
  '/dashboard',
  '/learning',
  '/profile',
  '/notifications',
  '/settings',
  '/checkout',
] as const;
