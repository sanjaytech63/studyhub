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

export async function changePassword(payload: ChangePasswordFormValues): Promise<void> {
  await apiClient.post('/auth/change-password', {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  });
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

export async function revokeMySession(sessionId: string): Promise<void> {
  await apiClient.delete(`/me/sessions/${sessionId}`);
}

export async function revokeMyOtherSessions(): Promise<void> {
  await apiClient.delete('/me/sessions');
}

export async function requestEmailChange(payload: ChangeEmailPayload): Promise<void> {
  await apiClient.post('/me/change-email', payload);
}

export async function verifyEmailChange(payload: VerifyEmailChangePayload): Promise<void> {
  await apiClient.post('/me/verify-email-change', payload);
}

export async function resendEmailChangeOtp(payload: ResendEmailChangePayload): Promise<void> {
  await apiClient.post('/me/change-email/resend', payload);
}

export async function uploadAvatar(file: File): Promise<Profile> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiClient.post<{
    success: boolean;
    data: {
      user: Profile;
    };
  }>('/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data.user;
}

export async function deleteAvatar(): Promise<Profile> {
  const response = await apiClient.delete<{
    success: boolean;
    data: {
      user: Profile;
    };
  }>('/me/avatar');

  return response.data.data.user;
}
