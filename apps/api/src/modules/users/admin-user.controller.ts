import type { RequestHandler } from 'express';
import { ApiResponse } from '@/utils/api-response';
import { asyncHandler } from '@/utils/async-handler';
import {
  createUser,
  deleteUser,
  getStats,
  getUserById,
  getUserSessions,
  listUsers,
  removeUserAvatarAdmin,
  revokeUserSessions,
  updateUser,
  uploadUserAvatarAdmin,
} from './admin-user.service';
import {
  adminCreateUserSchema,
  adminListUsersQuerySchema,
  adminUpdateUserSchema,
  adminUserIdParamSchema,
} from './admin-user.schema';

export const adminGetUsersController: RequestHandler = asyncHandler(async (req, res) => {
  const query = adminListUsersQuerySchema.parse(req.query);
  const result = await listUsers(query);
  return ApiResponse.ok(res, result);
});

export const adminGetUserController: RequestHandler = asyncHandler(async (req, res) => {
  const { userId } = adminUserIdParamSchema.parse(req.params);
  const user = await getUserById(userId);
  return ApiResponse.ok(res, { user });
});

export const adminUpdateUserController: RequestHandler = asyncHandler(async (req, res) => {
  const { userId } = adminUserIdParamSchema.parse(req.params);
  const input = adminUpdateUserSchema.parse(req.body);
  const user = await updateUser(userId, input);
  return ApiResponse.ok(res, { user, message: 'User updated successfully.' });
});

export const adminDeleteUserController: RequestHandler = asyncHandler(async (req, res) => {
  const { userId } = adminUserIdParamSchema.parse(req.params);
  await deleteUser(userId);
  return ApiResponse.ok(res, { message: 'User account marked as deleted successfully.' });
});

export const adminGetStatsController: RequestHandler = asyncHandler(async (_req, res) => {
  const stats = await getStats();
  return ApiResponse.ok(res, { stats });
});

export const adminCreateUserController: RequestHandler = asyncHandler(async (req, res) => {
  const input = adminCreateUserSchema.parse(req.body);
  const user = await createUser(input);
  return ApiResponse.created(res, { user, message: 'User created successfully.' });
});

export const adminGetUserSessionsController: RequestHandler = asyncHandler(async (req, res) => {
  const { userId } = adminUserIdParamSchema.parse(req.params);
  const sessions = await getUserSessions(userId);
  return ApiResponse.ok(res, { sessions });
});

export const adminRevokeUserSessionsController: RequestHandler = asyncHandler(async (req, res) => {
  const { userId } = adminUserIdParamSchema.parse(req.params);
  await revokeUserSessions(userId);
  return ApiResponse.ok(res, { message: 'All user sessions have been revoked.' });
});

export const adminUploadUserAvatarController: RequestHandler = asyncHandler(async (req, res) => {
  const { userId } = adminUserIdParamSchema.parse(req.params);
  const user = await uploadUserAvatarAdmin(userId, req.file!.buffer);

  return ApiResponse.ok(res, {
    user,
    message: 'User avatar uploaded successfully.',
  });
});

export const adminRemoveUserAvatarController: RequestHandler = asyncHandler(async (req, res) => {
  const { userId } = adminUserIdParamSchema.parse(req.params);
  const user = await removeUserAvatarAdmin(userId);

  return ApiResponse.ok(res, {
    user,
    message: 'User avatar removed successfully.',
  });
});
