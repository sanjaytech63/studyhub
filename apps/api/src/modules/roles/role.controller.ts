import type { RequestHandler } from 'express';
import { ApiResponse } from '@/utils/api-response';
import { asyncHandler } from '@/utils/async-handler';
import { getAllRoles } from './role.service';

export const getRolesController: RequestHandler = asyncHandler(async (_req, res) => {
  const roles = await getAllRoles();
  return ApiResponse.ok(res, roles);
});
