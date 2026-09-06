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

export async function createAdminUser(payload: CreateUserPayload): Promise<AdminUserDetail> {
  const response = await apiClient.post<{ success: boolean; data: { user: AdminUserDetail } }>(
    '/admin/users',
    payload,
  );
  return response.data.data.user;
}

export async function updateAdminUser(
  userId: string,
  payload: AdminUpdateUserPayload,
): Promise<AdminUserDetail> {
  const response = await apiClient.patch<{ success: boolean; data: { user: AdminUserDetail } }>(
    `/admin/users/${userId}`,
    payload,
  );
  return response.data.data.user;
}

export async function deleteAdminUser(userId: string): Promise<void> {
  await apiClient.delete(`/admin/users/${userId}`);
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

export async function revokeUserSessions(userId: string): Promise<void> {
  await apiClient.post(`/admin/users/${userId}/revoke-sessions`);
}

export async function uploadAdminUserAvatar(userId: string, file: File): Promise<AdminUserDetail> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiClient.post<{
    success: boolean;
    data: { user: AdminUserDetail };
  }>(`/admin/users/${userId}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data.user;
}

export async function deleteAdminUserAvatar(userId: string): Promise<AdminUserDetail> {
  const response = await apiClient.delete<{
    success: boolean;
    data: { user: AdminUserDetail };
  }>(`/admin/users/${userId}/avatar`);
  return response.data.data.user;
}
