import { apiClient } from '@/lib/api/api-client';
import type { ChangePasswordFormValues } from '@/lib/profile/change-password.schema';
import type { Profile, UpdateProfilePayload } from '@/lib/profile/profile.types';
import type {
  ChangeEmailPayload,
  ResendEmailChangePayload,
  UserSession,
  VerifyEmailChangePayload,
} from '@/lib/profile/sessions.types';

export async function getProfile(): Promise<Profile> {
  const response = await apiClient.get<{
    success: boolean;
    data: {
      user: Profile;
    };
  }>('/me');

  return response.data.data.user;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
  const response = await apiClient.patch<{
    success: boolean;
    data: {
      user: Profile;
    };
  }>('/me', payload);

  return response.data.data.user;
}

export async function changePassword(
  payload: ChangePasswordFormValues,
): Promise<{ message?: string }> {
  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>('/auth/change-password', {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  });
  return {
    message:
      response.data?.message || response.data?.data?.message || 'Password changed successfully.',
  };
}

export async function getMySessions(): Promise<readonly UserSession[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: {
      sessions: readonly UserSession[];
    };
  }>('/me/sessions');

  return response.data.data.sessions;
}

export async function revokeMySession(sessionId: string): Promise<{ message?: string }> {
  const response = await apiClient.delete<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>(`/me/sessions/${sessionId}`);
  return {
    message:
      response.data?.message || response.data?.data?.message || 'Session revoked successfully.',
  };
}

export async function revokeMyOtherSessions(): Promise<{ message?: string }> {
  const response = await apiClient.delete<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>('/me/sessions');
  return {
    message:
      response.data?.message ||
      response.data?.data?.message ||
      'All other sessions have been revoked.',
  };
}

export async function requestEmailChange(
  payload: ChangeEmailPayload,
): Promise<{ message?: string }> {
  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>('/me/change-email', payload);
  return { message: response.data?.message || response.data?.data?.message };
}

export async function verifyEmailChange(
  payload: VerifyEmailChangePayload,
): Promise<{ message?: string }> {
  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>('/me/verify-email-change', payload);
  return { message: response.data?.message || response.data?.data?.message };
}

export async function resendEmailChangeOtp(
  payload: ResendEmailChangePayload,
): Promise<{ message?: string }> {
  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>('/me/change-email/resend', payload);
  return { message: response.data?.message || response.data?.data?.message };
}

export async function uploadAvatar(file: File): Promise<Profile & { message?: string }> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data: {
      user: Profile;
      message?: string;
    };
  }>('/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const msg = response.data?.message || response.data?.data?.message;
  return { ...response.data.data.user, ...(msg ? { message: msg } : {}) };
}

export async function deleteAvatar(): Promise<Profile & { message?: string }> {
  const response = await apiClient.delete<{
    success: boolean;
    message?: string;
    data: {
      user: Profile;
      message?: string;
    };
  }>('/me/avatar');

  const msg = response.data?.message || response.data?.data?.message;
  return { ...response.data.data.user, ...(msg ? { message: msg } : {}) };
}
