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

export async function createRole(payload: CreateRolePayload): Promise<Role & { message?: string }> {
  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data: Role;
  }>('/roles', payload);
  const msg = response.data?.message || 'Role created successfully.';
  return { ...response.data.data, message: msg };
}

export async function updateRole(
  roleId: string,
  payload: UpdateRolePayload,
): Promise<Role & { message?: string }> {
  const response = await apiClient.patch<{
    success: boolean;
    message?: string;
    data: Role;
  }>(`/roles/${roleId}`, payload);
  const msg = response.data?.message || 'Role updated successfully.';
  return { ...response.data.data, message: msg };
}

export async function deleteRole(roleId: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>(`/roles/${roleId}`);
  return {
    message: response.data?.message || response.data?.data?.message || 'Role deleted successfully.',
  };
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
): Promise<{ message: string }> {
  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>(`/roles/${roleId}/permissions`, payload);
  return {
    message:
      response.data?.message ||
      response.data?.data?.message ||
      'Permission assigned to role successfully.',
  };
}

export async function removeRolePermission(
  roleId: string,
  permissionId: string,
): Promise<{ message: string }> {
  const response = await apiClient.delete<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>(`/roles/${roleId}/permissions/${permissionId}`);
  return {
    message:
      response.data?.message ||
      response.data?.data?.message ||
      'Permission removed from role successfully.',
  };
}

export async function replaceRolePermissions(
  roleId: string,
  payload: ReplaceRolePermissionsPayload,
): Promise<{ message: string }> {
  const response = await apiClient.put<{
    success: boolean;
    message?: string;
    data?: { message?: string };
  }>(`/roles/${roleId}/permissions`, payload);
  return {
    message:
      response.data?.message ||
      response.data?.data?.message ||
      'Role permissions updated successfully.',
  };
}
