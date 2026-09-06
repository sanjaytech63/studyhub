import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  assignRolePermission,
  createRole,
  deleteRole,
  getPermissions,
  getRoleById,
  getRolePermissions,
  getRoles,
  removeRolePermission,
  replaceRolePermissions,
  updateRole,
} from '@/services/admin/admin-roles.service';
import type {
  AssignRolePermissionPayload,
  CreateRolePayload,
  ReplaceRolePermissionsPayload,
  Role,
  UpdateRolePayload,
} from './admin-roles.types';
import { adminRoleKeys } from './admin-roles.keys';

export const rolesQueryOptions = queryOptions({
  queryKey: adminRoleKeys.lists(),
  queryFn: getRoles,
  staleTime: 5 * 60 * 1000,
});

export function roleDetailQueryOptions(roleId: string) {
  return queryOptions({
    queryKey: adminRoleKeys.detail(roleId),
    queryFn: () => getRoleById(roleId),
    enabled: Boolean(roleId),
  });
}

export const permissionsQueryOptions = queryOptions({
  queryKey: adminRoleKeys.allPermissions,
  queryFn: getPermissions,
  staleTime: 10 * 60 * 1000,
});

export function rolePermissionsQueryOptions(roleId: string) {
  return queryOptions({
    queryKey: adminRoleKeys.permissions(roleId),
    queryFn: () => getRolePermissions(roleId),
    enabled: Boolean(roleId),
  });
}

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, CreateRolePayload>({
    mutationFn: createRole,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminRoleKeys.lists() });
    },
  });
}

export function useUpdateRoleMutation(roleId: string) {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, UpdateRolePayload>({
    mutationFn: (payload) => updateRole(roleId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminRoleKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: adminRoleKeys.detail(roleId) });
    },
  });
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteRole,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminRoleKeys.lists() });
    },
  });
}

export function useAssignRolePermissionMutation(roleId: string) {
  const queryClient = useQueryClient();
  return useMutation<{ roleId: string; permissionId: string }, Error, AssignRolePermissionPayload>({
    mutationFn: (payload) => assignRolePermission(roleId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminRoleKeys.permissions(roleId) });
      void queryClient.invalidateQueries({ queryKey: adminRoleKeys.lists() });
    },
  });
}

export function useRemoveRolePermissionMutation(roleId: string) {
  const queryClient = useQueryClient();
  return useMutation<{ roleId: string; permissionId: string; removed: boolean }, Error, string>({
    mutationFn: (permissionId) => removeRolePermission(roleId, permissionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminRoleKeys.permissions(roleId) });
      void queryClient.invalidateQueries({ queryKey: adminRoleKeys.lists() });
    },
  });
}

export function useReplaceRolePermissionsMutation(roleId: string) {
  const queryClient = useQueryClient();
  return useMutation<
    { roleId: string; permissionIds: readonly string[] },
    Error,
    ReplaceRolePermissionsPayload
  >({
    mutationFn: (payload) => replaceRolePermissions(roleId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminRoleKeys.permissions(roleId) });
      void queryClient.invalidateQueries({ queryKey: adminRoleKeys.lists() });
    },
  });
}
