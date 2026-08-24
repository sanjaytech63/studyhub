import {
  apiClient,
  clearAuthTokens,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setSessionId,
} from '@/lib/api/api-client';

import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  ResetPasswordResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from '@/lib/auth/auth.types';

/**
 * ============================================================================
 * Login
 * ============================================================================
 */

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<{
    success: boolean;
    data: AuthResponse;
  }>('/auth/login', payload);

  const data = response.data.data;

  setAccessToken(data.accessToken);
  setRefreshToken(data.refreshToken);
  setSessionId(data.sessionId);

  return data;
}

/**
 * ============================================================================
 * Register
 * ============================================================================
 */

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiClient.post<{
    success: boolean;
    data: AuthResponse;
  }>('/auth/register', payload);

  return response.data.data;
}

/**
 * ============================================================================
 * Verify OTP
 * ============================================================================
 */

export async function verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
  const response = await apiClient.post<{
    success: boolean;
    data: VerifyOtpResponse;
  }>('/auth/verify-otp', payload);

  return response.data.data;
}

/**
 * ============================================================================
 * Resend OTP
 * ============================================================================
 */

export async function resendOtp(email: string): Promise<void> {
  await apiClient.post('/auth/resend-otp', {
    email,
  });
}

/**
 * ============================================================================
 * Forgot Password
 * ============================================================================
 */

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  await apiClient.post('/auth/forgot-password', payload);
}

/**
 * ============================================================================
 * Reset Password
 * ============================================================================
 */

export async function resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  const response = await apiClient.post<{
    success: boolean;
    data: ResetPasswordResponse;
  }>('/auth/reset-password', payload);

  return response.data.data;
}

/**
 * ============================================================================
 * Refresh Session
 * ============================================================================
 */

export async function refreshSession(): Promise<string> {
  const currentRefreshToken = getRefreshToken();

  if (!currentRefreshToken) {
    throw new Error('No refresh token available.');
  }

  const response = await apiClient.post<{
    success: boolean;
    data: {
      accessToken: string;
      refreshToken: string;
      sessionId: string;
    };
  }>('/auth/refresh', {
    refreshToken: currentRefreshToken,
  });

  const data = response.data.data;

  setAccessToken(data.accessToken);
  setRefreshToken(data.refreshToken);
  setSessionId(data.sessionId);

  return data.accessToken;
}

/**
 * ============================================================================
 * Logout
 * ============================================================================
 */

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    clearAuthTokens();
  }
}
