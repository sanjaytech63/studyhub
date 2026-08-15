import { apiClient } from '@/lib/api/api-client';

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

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload);
  return response.data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', payload);
  return response.data;
}

export async function verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
  const response = await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', payload);
  return response.data;
}

export async function resendOtp(email: string): Promise<void> {
  await apiClient.post('/auth/resend-otp', {
    email,
  });
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  await apiClient.post('/auth/forgot-password', payload);
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  const response = await apiClient.post<ResetPasswordResponse>('/auth/reset-password', payload);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
