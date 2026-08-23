import type { RequestHandler } from 'express';
import { ApiResponse } from '@/utils/api-response';
import { asyncHandler } from '@/utils/async-handler';
import { getAllPermissions } from './permission.service';

export const getPermissionsController: RequestHandler = asyncHandler(async (_req, res) => {
  const permissions = await getAllPermissions();
  return ApiResponse.ok(res, permissions);
});
