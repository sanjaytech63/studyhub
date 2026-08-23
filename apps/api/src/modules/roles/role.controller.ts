import type { RequestHandler } from 'express';
import { ApiResponse } from '@/utils/api-response';
import { asyncHandler } from '@/utils/async-handler';
import {
  createCustomRole,
  deleteCustomRole,
  getAllRoles,
  getRoleById,
  updateCustomRole,
} from './role.service';
import { roleIdParamSchema } from './role-permission.schema';
import { createRoleSchema, updateRoleSchema } from './role.schema';

export const getRolesController: RequestHandler = asyncHandler(async (_req, res) => {
  const roles = await getAllRoles();
  return ApiResponse.ok(res, roles);
});

export const getRoleController: RequestHandler = asyncHandler(async (req, res) => {
  const { roleId } = roleIdParamSchema.parse(req.params);
  const role = await getRoleById(roleId);
  return ApiResponse.ok(res, role);
});

export const createRoleController: RequestHandler = asyncHandler(async (req, res) => {
  const input = createRoleSchema.parse(req.body);
  const role = await createCustomRole(input);
  return ApiResponse.created(res, role);
});

export const updateRoleController: RequestHandler = asyncHandler(async (req, res) => {
  const { roleId } = roleIdParamSchema.parse(req.params);
  const input = updateRoleSchema.parse(req.body);
  const role = await updateCustomRole(roleId, input);
  return ApiResponse.ok(res, role);
});

export const deleteRoleController: RequestHandler = asyncHandler(async (req, res) => {
  const { roleId } = roleIdParamSchema.parse(req.params);
  await deleteCustomRole(roleId);
  return ApiResponse.noContent(res);
});
