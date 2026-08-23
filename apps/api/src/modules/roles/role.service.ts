import { AppError } from '@/errors/app-error';
import {
  countUsersByRoleId,
  createRoleWithPermissions,
  deleteRole,
  findAllRoles,
  findRoleById,
  updateRole,
} from './role.repository';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';
import { CreateRoleInput, UpdateRoleInput } from './role.schema';
import { invalidateRolePermissionCache } from './role-permission.cache';

export const getAllRoles = async () => {
  return findAllRoles();
};

export const getRoleById = async (roleId: string) => {
  const role = await findRoleById(roleId);

  if (!role) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, 'Role not found.');
  }

  return role;
};

export const createCustomRole = async (input: CreateRoleInput) => {
  return createRoleWithPermissions(input);
};

export const updateCustomRole = async (roleId: string, input: UpdateRoleInput) => {
  const role = await findRoleById(roleId);

  if (!role) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, 'Role not found.');
  }

  if (role.type === 'SYSTEM') {
    throw new AppError(
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.FORBIDDEN,
      'System roles cannot be modified.',
    );
  }

  return updateRole(roleId, input);
};

export const deleteCustomRole = async (roleId: string): Promise<void> => {
  const role = await findRoleById(roleId);

  if (!role) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, 'Role not found.');
  }

  if (role.type === 'SYSTEM') {
    throw new AppError(
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.FORBIDDEN,
      'System roles cannot be deleted.',
    );
  }

  const userCount = await countUsersByRoleId(roleId);

  if (userCount > 0) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.RESOURCE_CONFLICT,
      'Role cannot be deleted while users are assigned to it.',
    );
  }

  // Delete role and its role-permission relationships.
  await deleteRole(roleId);

  // Remove stale permissions from Redis.
  await invalidateRolePermissionCache(roleId);
};
