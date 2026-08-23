import { AppError } from '@/errors/app-error';
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
import { findRoleById } from './role.repository';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';

export const assignRolePermission = async (roleId: string, permissionId: string): Promise<void> => {
  await assignPermissionToRole(roleId, permissionId);
  await invalidateRolePermissionCache(roleId);
};

export const removeRolePermission = async (roleId: string, permissionId: string): Promise<void> => {
  await removePermissionFromRole(roleId, permissionId);
  await invalidateRolePermissionCache(roleId);
};

export const getRolePermissions = async (roleId: string): Promise<string[]> => {
  const role = await findRoleById(roleId);

  if (!role) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, 'Role not found.');
  }

  const cachedPermissions = await getCachedRolePermissions(roleId);

  if (cachedPermissions !== null) {
    return cachedPermissions;
  }

  const permissionRecords = await findPermissionsByRoleId(roleId);
  const permissions = permissionRecords.map(({ permission }) => permission.name);
  await setCachedRolePermissions(roleId, permissions);
  return permissions;
};
