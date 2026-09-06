import { apiClient } from '@/lib/api/api-client';
import type {
  AssignRolePermissionPayload,
  CreateRolePayload,
  Permission,
  ReplaceRolePermissionsPayload,
  Role,
  RolePermissionsResponse,
  UpdateRolePayload,
} from '@/lib/admin/admin-roles.types';

export async function getRoles(): Promise<readonly Role[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: readonly Role[];
  }>('/roles');

  return response.data.data;
}

export async function getRoleById(roleId: string): Promise<Role> {
  const response = await apiClient.get<{
    success: boolean;
    data: Role;
  }>(`/roles/${roleId}`);

  return response.data.data;
}

export async function createRole(payload: CreateRolePayload): Promise<Role> {
  const response = await apiClient.post<{
    success: boolean;
    data: Role;
  }>('/roles', payload);

  return response.data.data;
}

export async function updateRole(roleId: string, payload: UpdateRolePayload): Promise<Role> {
  const response = await apiClient.patch<{
    success: boolean;
    data: Role;
  }>(`/roles/${roleId}`, payload);

  return response.data.data;
}

export async function deleteRole(roleId: string): Promise<void> {
  await apiClient.delete(`/roles/${roleId}`);
}

export async function getPermissions(): Promise<readonly Permission[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: readonly Permission[];
  }>('/permissions');

  return response.data.data;
}

export async function getRolePermissions(roleId: string): Promise<RolePermissionsResponse> {
  const response = await apiClient.get<{
    success: boolean;
    data: RolePermissionsResponse;
  }>(`/roles/${roleId}/permissions`);

  return response.data.data;
}

export async function assignRolePermission(
  roleId: string,
  payload: AssignRolePermissionPayload,
): Promise<{ roleId: string; permissionId: string }> {
  const response = await apiClient.post<{
    success: boolean;
    data: { roleId: string; permissionId: string };
  }>(`/roles/${roleId}/permissions`, payload);

  return response.data.data;
}

export async function removeRolePermission(
  roleId: string,
  permissionId: string,
): Promise<{ roleId: string; permissionId: string; removed: boolean }> {
  const response = await apiClient.delete<{
    success: boolean;
    data: { roleId: string; permissionId: string; removed: boolean };
  }>(`/roles/${roleId}/permissions/${permissionId}`);

  return response.data.data;
}

export async function replaceRolePermissions(
  roleId: string,
  payload: ReplaceRolePermissionsPayload,
): Promise<{ roleId: string; permissionIds: readonly string[] }> {
  const response = await apiClient.put<{
    success: boolean;
    data: { roleId: string; permissionIds: readonly string[] };
  }>(`/roles/${roleId}/permissions`, payload);

  return response.data.data;
}
