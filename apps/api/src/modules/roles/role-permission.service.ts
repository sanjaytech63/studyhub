import {
  getCachedRolePermissions,
  invalidateRolePermissionCache,
  setCachedRolePermissions,
} from './role-permission.cache';
import {
  assignPermissionToRole,
  findPermissionsByRoleId,
  removePermissionFromRole,
} from './role-permission.repository';

export const assignRolePermission = async (roleId: string, permissionId: string): Promise<void> => {
  await assignPermissionToRole(roleId, permissionId);
  await invalidateRolePermissionCache(roleId);
};

export const removeRolePermission = async (roleId: string, permissionId: string): Promise<void> => {
  await removePermissionFromRole(roleId, permissionId);
  await invalidateRolePermissionCache(roleId);
};

export const getRolePermissions = async (roleId: string): Promise<string[]> => {
  const cachedPermissions = await getCachedRolePermissions(roleId);

  if (cachedPermissions !== null) {
    return cachedPermissions;
  }

  const permissionRecords = await findPermissionsByRoleId(roleId);
  const permissions = permissionRecords.map(({ permission }) => permission.name);

  await setCachedRolePermissions(roleId, permissions);
  return permissions;
};
