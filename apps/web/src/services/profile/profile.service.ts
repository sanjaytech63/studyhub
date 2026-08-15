import { apiClient } from '@/lib/api/api-client';

import type { ChangePasswordFormValues } from '@/lib/profile/change-password.schema';
import type { Profile, UpdateProfilePayload } from '@/lib/profile/profile.types';

export async function getProfile(): Promise<Profile> {
  const response = await apiClient.get<Profile>('/profile');
  return response.data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
  const response = await apiClient.patch<Profile>('/profile', payload);
  return response.data;
}

export async function changePassword(payload: ChangePasswordFormValues): Promise<void> {
  await apiClient.patch('/profile/password', {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  });
}
