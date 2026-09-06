import { apiClient } from '@/lib/api/api-client';

export interface AdminProfile {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName?: string | null;
  readonly avatarUrl?: string | null;
  readonly status: string;
  readonly emailVerifiedAt?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly role: {
    readonly id: string;
    readonly name: string;
    readonly type?: 'SYSTEM' | 'CUSTOM';
  };
}

export interface UpdateAdminProfilePayload {
  readonly firstName: string;
  readonly lastName?: string | null;
}

export interface ChangeAdminPasswordPayload {
  readonly currentPassword: string;
  readonly newPassword: string;
}

export async function getAdminProfile(): Promise<AdminProfile> {
  const response = await apiClient.get<{
    success: boolean;
    data: { user: AdminProfile };
  }>('/me');
  return response.data.data.user;
}

export async function updateAdminProfile(
  payload: UpdateAdminProfilePayload,
): Promise<AdminProfile> {
  const response = await apiClient.patch<{
    success: boolean;
    data: { user: AdminProfile };
  }>('/me', payload);
  return response.data.data.user;
}

export async function changeAdminPassword(payload: ChangeAdminPasswordPayload): Promise<void> {
  await apiClient.post('/auth/change-password', payload);
}

export async function requestAdminEmailChange(payload: { newEmail: string }): Promise<void> {
  await apiClient.post('/me/change-email', payload);
}

export async function verifyAdminEmailChange(payload: { otp: string }): Promise<AdminProfile> {
  const response = await apiClient.post<{
    success: boolean;
    data: { user: AdminProfile };
  }>('/me/verify-email-change', payload);
  return response.data.data.user;
}

export async function resendAdminEmailChangeOtp(payload: { newEmail: string }): Promise<void> {
  await apiClient.post('/me/change-email/resend', payload);
}

export async function uploadAdminSelfAvatar(file: File): Promise<AdminProfile> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiClient.post<{
    success: boolean;
    data: { user: AdminProfile };
  }>('/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data.user;
}

export async function deleteAdminSelfAvatar(): Promise<AdminProfile> {
  const response = await apiClient.delete<{
    success: boolean;
    data: { user: AdminProfile };
  }>('/me/avatar');
  return response.data.data.user;
}
