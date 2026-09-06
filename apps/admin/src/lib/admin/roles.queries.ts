import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRoles,
  getRoleById,
  getPermissions,
  getRolePermissions,
  createRole,
  updateRole,
  deleteRole,
  assignRolePermission,
  removeRolePermission,
  replaceRolePermissions,
} from '@/services/roles.service';
import type {
  CreateRolePayload,
  UpdateRolePayload,
  Role,
  AssignRolePermissionPayload,
  ReplaceRolePermissionsPayload,
} from './roles.types';

export const rolesQueryOptions = queryOptions({
  queryKey: ['admin', 'roles'],
  queryFn: getRoles,
  staleTime: 5 * 60 * 1000,
});

export const permissionsQueryOptions = queryOptions({
  queryKey: ['admin', 'permissions'],
  queryFn: getPermissions,
  staleTime: 10 * 60 * 1000,
});

export function roleDetailQueryOptions(roleId: string) {
  return queryOptions({
    queryKey: ['admin', 'roles', roleId],
    queryFn: () => getRoleById(roleId),
    enabled: Boolean(roleId),
  });
}

export function rolePermissionsQueryOptions(roleId: string) {
  return queryOptions({
    queryKey: ['admin', 'roles', roleId, 'permissions'],
    queryFn: () => getRolePermissions(roleId),
    enabled: Boolean(roleId),
  });
}

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation<Role & { message?: string }, Error, CreateRolePayload>({
    mutationFn: createRole,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] }),
  });
}

export function useUpdateRoleMutation(roleId: string) {
  const queryClient = useQueryClient();
  return useMutation<Role & { message?: string }, Error, UpdateRolePayload>({
    mutationFn: (payload) => updateRole(roleId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
    },
  });
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteRole,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] }),
  });
}

export function useAssignPermissionMutation(roleId: string) {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, AssignRolePermissionPayload>({
    mutationFn: (payload) => assignRolePermission(roleId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'roles', roleId, 'permissions'] });
    },
  });
}

export function useRemovePermissionMutation(roleId: string) {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (permissionId) => removeRolePermission(roleId, permissionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'roles', roleId, 'permissions'] });
    },
  });
}

export function useReplacePermissionsMutation(roleId: string) {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, ReplaceRolePermissionsPayload>({
    mutationFn: (payload) => replaceRolePermissions(roleId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'roles', roleId, 'permissions'] });
    },
  });
}
