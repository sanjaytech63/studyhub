import { invalidateRolePermissionCache } from './role-permission.cache';
import { assignPermissionToRole, removePermissionFromRole } from './role-permission.repository';

export const assignRolePermission = async (roleId: string, permissionId: string): Promise<void> => {
  await assignPermissionToRole(roleId, permissionId);
  await invalidateRolePermissionCache(roleId);
};

export const removeRolePermission = async (roleId: string, permissionId: string): Promise<void> => {
  await removePermissionFromRole(roleId, permissionId);
  await invalidateRolePermissionCache(roleId);
};
