import { apiClient } from '@/lib/api/api-client';
import type {
  AdminUsersResponse,
  AdminUserDetail,
  AdminStatsResponse,
  AdminListUsersParams,
  AdminUpdateUserPayload,
  CreateUserPayload,
  UserSessionSummary,
} from '@/lib/admin/users.types';

export async function getAdminUsers(params: AdminListUsersParams): Promise<AdminUsersResponse> {
  const response = await apiClient.get<{ success: boolean; data: AdminUsersResponse }>(
    '/admin/users',
    { params },
  );
  return response.data.data;
}

export async function getAdminUser(userId: string): Promise<AdminUserDetail> {
  const response = await apiClient.get<{ success: boolean; data: { user: AdminUserDetail } }>(
    `/admin/users/${userId}`,
  );
  return response.data.data.user;
}

export async function createAdminUser(
  payload: CreateUserPayload,
): Promise<AdminUserDetail & { message?: string }> {
  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data: { user: AdminUserDetail; message?: string };
  }>('/admin/users', payload);
  const msg =
    response.data?.message || response.data?.data?.message || 'User created successfully.';
  return { ...response.data.data.user, message: msg };
}

export async function updateAdminUser(
  userId: string,
  payload: AdminUpdateUserPayload,
): Promise<AdminUserDetail & { message?: string }> {
  const response = await apiClient.patch<{
    success: boolean;
    message?: string;
    data: { user: AdminUserDetail; message?: string };
  }>(`/admin/users/${userId}`, payload);
  const msg =
    response.data?.message || response.data?.data?.message || 'User updated successfully.';
  return { ...response.data.data.user, message: msg };
}

export async function deleteAdminUser(userId: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>(`/admin/users/${userId}`);
  return {
    message: response.data?.message || response.data?.data?.message || 'User deleted successfully.',
  };
}

export async function getAdminStats(): Promise<AdminStatsResponse> {
  const response = await apiClient.get<{ success: boolean; data: { stats: AdminStatsResponse } }>(
    '/admin/stats',
  );
  return response.data.data.stats;
}

export async function getUserSessions(userId: string): Promise<readonly UserSessionSummary[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: { sessions: readonly UserSessionSummary[] };
  }>(`/admin/users/${userId}/sessions`);
  return response.data.data.sessions;
}

export async function revokeUserSessions(userId: string): Promise<{ message: string }> {
  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>(`/admin/users/${userId}/revoke-sessions`);
  return {
    message:
      response.data?.message ||
      response.data?.data?.message ||
      'All user sessions have been revoked.',
  };
}

export async function uploadAdminUserAvatar(
  userId: string,
  file: File,
): Promise<AdminUserDetail & { message?: string }> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data: { user: AdminUserDetail; message?: string };
  }>(`/admin/users/${userId}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  const msg =
    response.data?.message || response.data?.data?.message || 'User avatar uploaded successfully.';
  return { ...response.data.data.user, message: msg };
}

export async function deleteAdminUserAvatar(
  userId: string,
): Promise<AdminUserDetail & { message?: string }> {
  const response = await apiClient.delete<{
    success: boolean;
    message?: string;
    data: { user: AdminUserDetail; message?: string };
  }>(`/admin/users/${userId}/avatar`);
  const msg =
    response.data?.message || response.data?.data?.message || 'User avatar removed successfully.';
  return { ...response.data.data.user, message: msg };
}
