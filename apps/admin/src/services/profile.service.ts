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
): Promise<AdminProfile & { message?: string }> {
  const response = await apiClient.patch<{
    success: boolean;
    message?: string;
    data: { user: AdminProfile; message?: string };
  }>('/me', payload);
  const msg =
    response.data?.message || response.data?.data?.message || 'Profile updated successfully.';
  return { ...response.data.data.user, message: msg };
}

export async function changeAdminPassword(
  payload: ChangeAdminPasswordPayload,
): Promise<{ message: string }> {
  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>('/auth/change-password', payload);
  return {
    message:
      response.data?.message || response.data?.data?.message || 'Password changed successfully.',
  };
}

export async function requestAdminEmailChange(payload: {
  newEmail: string;
}): Promise<{ message: string }> {
  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>('/me/change-email', payload);
  return {
    message: response.data?.message || response.data?.data?.message || 'Verification OTP sent.',
  };
}

export async function verifyAdminEmailChange(payload: {
  otp: string;
}): Promise<AdminProfile & { message?: string }> {
  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data: { user: AdminProfile; message?: string };
  }>('/me/verify-email-change', payload);
  const msg =
    response.data?.message || response.data?.data?.message || 'Email address updated successfully.';
  return { ...response.data.data.user, message: msg };
}

export async function resendAdminEmailChangeOtp(payload: {
  newEmail: string;
}): Promise<{ message: string }> {
  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>('/me/change-email/resend', payload);
  return {
    message:
      response.data?.message || response.data?.data?.message || 'New verification code sent.',
  };
}

export async function uploadAdminSelfAvatar(
  file: File,
): Promise<AdminProfile & { message?: string }> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data: { user: AdminProfile; message?: string };
  }>('/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  const msg =
    response.data?.message ||
    response.data?.data?.message ||
    'Profile avatar updated successfully.';
  return { ...response.data.data.user, message: msg };
}

export async function deleteAdminSelfAvatar(): Promise<AdminProfile & { message?: string }> {
  const response = await apiClient.delete<{
    success: boolean;
    message?: string;
    data: { user: AdminProfile; message?: string };
  }>('/me/avatar');
  const msg =
    response.data?.message ||
    response.data?.data?.message ||
    'Profile avatar removed successfully.';
  return { ...response.data.data.user, message: msg };
}
