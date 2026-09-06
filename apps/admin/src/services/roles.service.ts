import { apiClient } from '@/lib/api/api-client';
import type {
  Role,
  Permission,
  CreateRolePayload,
  UpdateRolePayload,
  RolePermissionsResponse,
  AssignRolePermissionPayload,
  ReplaceRolePermissionsPayload,
} from '@/lib/admin/roles.types';

export async function getRoles(): Promise<readonly Role[]> {
  const response = await apiClient.get<{ success: boolean; data: readonly Role[] }>('/roles');
  return response.data.data;
}

export async function getRoleById(roleId: string): Promise<Role> {
  const response = await apiClient.get<{ success: boolean; data: Role }>(`/roles/${roleId}`);
  return response.data.data;
}

export async function createRole(payload: CreateRolePayload): Promise<Role> {
  const response = await apiClient.post<{ success: boolean; data: Role }>('/roles', payload);
  return response.data.data;
}

export async function updateRole(roleId: string, payload: UpdateRolePayload): Promise<Role> {
  const response = await apiClient.patch<{ success: boolean; data: Role }>(
    `/roles/${roleId}`,
    payload,
  );
  return response.data.data;
}

export async function deleteRole(roleId: string): Promise<void> {
  await apiClient.delete(`/roles/${roleId}`);
}

export async function getPermissions(): Promise<readonly Permission[]> {
  const response = await apiClient.get<{ success: boolean; data: readonly Permission[] }>(
    '/permissions',
  );
  return response.data.data;
}

export async function getRolePermissions(roleId: string): Promise<RolePermissionsResponse> {
  const response = await apiClient.get<{ success: boolean; data: RolePermissionsResponse }>(
    `/roles/${roleId}/permissions`,
  );
  return response.data.data;
}

export async function assignRolePermission(
  roleId: string,
  payload: AssignRolePermissionPayload,
): Promise<void> {
  await apiClient.post(`/roles/${roleId}/permissions`, payload);
}

export async function removeRolePermission(roleId: string, permissionId: string): Promise<void> {
  await apiClient.delete(`/roles/${roleId}/permissions/${permissionId}`);
}

export async function replaceRolePermissions(
  roleId: string,
  payload: ReplaceRolePermissionsPayload,
): Promise<void> {
  await apiClient.put(`/roles/${roleId}/permissions`, payload);
}
