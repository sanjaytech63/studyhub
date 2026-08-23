import type { RequestHandler } from 'express';

import { AppError } from '@/errors/app-error';
import { ERROR_CODES } from '@/errors/error-codes';
import { HTTP_STATUS } from '@/utils/http-status';
import { ApiResponse } from '@/utils/api-response';
import { asyncHandler } from '@/utils/async-handler';

import { assignRolePermission, removeRolePermission } from './role-permission.service';

const getRequiredParam = (value: string | string[] | undefined, name: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR,
      `${name} is required.`,
    );
  }

  return value.trim();
};
const getPermissionId = (body: unknown): string => {
  if (
    typeof body !== 'object' ||
    body === null ||
    !('permissionId' in body) ||
    typeof body.permissionId !== 'string' ||
    body.permissionId.trim().length === 0
  ) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR,
      'permissionId is required.',
    );
  }

  return body.permissionId.trim();
};

/**
 * POST /api/v1/roles/:roleId/permissions
 *
 * Assigns a permission to a role and invalidates
 * the role's cached permissions.
 */
export const assignPermissionController: RequestHandler = asyncHandler(async (req, res) => {
  const roleId = getRequiredParam(req.params.roleId, 'roleId');
  const permissionId = getPermissionId(req.body);
  await assignRolePermission(roleId, permissionId);

  return ApiResponse.created(res, {
    roleId,
    permissionId,
  });
});

/**
 * DELETE /api/v1/roles/:roleId/permissions/:permissionId
 *
 * Removes a permission from a role and invalidates
 * the role's cached permissions.
 */
export const removePermissionController: RequestHandler = asyncHandler(async (req, res) => {
  const roleId = getRequiredParam(req.params.roleId, 'roleId');
  const permissionId = getRequiredParam(req.params.permissionId, 'permissionId');
  await removeRolePermission(roleId, permissionId);

  return ApiResponse.ok(res, {
    roleId,
    permissionId,
    removed: true,
  });
});
