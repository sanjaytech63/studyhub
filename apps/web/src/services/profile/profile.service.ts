import { apiClient } from '@/lib/api/api-client';
import type { ChangePasswordFormValues } from '@/lib/profile/change-password.schema';
import type { Profile, UpdateProfilePayload } from '@/lib/profile/profile.types';

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
