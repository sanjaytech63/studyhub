import type { RequestHandler } from 'express';

import { ApiResponse } from '@/utils/api-response';
import { asyncHandler } from '@/utils/async-handler';
import {
  assignPermissionSchema,
  permissionIdParamSchema,
  roleIdParamSchema,
} from './role-permission.schema';
import {
  assignRolePermission,
  getRolePermissions,
  removeRolePermission,
} from './role-permission.service';

export const assignPermissionController: RequestHandler = asyncHandler(async (req, res) => {
  const { roleId } = permissionIdParamSchema
    .pick({
      roleId: true,
    })
    .parse(req.params);

  const { permissionId } = assignPermissionSchema.parse(req.body);
  await assignRolePermission(roleId, permissionId);

  return ApiResponse.created(res, {
    roleId,
    permissionId,
  });
});

export const removePermissionController: RequestHandler = asyncHandler(async (req, res) => {
  const { roleId, permissionId } = permissionIdParamSchema.parse(req.params);
  await removeRolePermission(roleId, permissionId);

  return ApiResponse.ok(res, {
    roleId,
    permissionId,
    removed: true,
  });
});

export const getRolePermissionsController: RequestHandler = asyncHandler(async (req, res) => {
  const { roleId } = roleIdParamSchema.parse(req.params);
  const permissions = await getRolePermissions(roleId);

  return ApiResponse.ok(res, {
    roleId,
    permissions,
  });
});
