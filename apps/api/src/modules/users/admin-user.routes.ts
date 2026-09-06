import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import { uploadSingleAvatar } from '@/middlewares/upload.middleware';
import {
  adminCreateUserController,
  adminDeleteUserController,
  adminGetStatsController,
  adminGetUserController,
  adminGetUserSessionsController,
  adminGetUsersController,
  adminRemoveUserAvatarController,
  adminRevokeUserSessionsController,
  adminUpdateUserController,
  adminUploadUserAvatarController,
} from './admin-user.controller';

const router = Router();

// All admin routes require auth and ROLE_PERMISSION_MANAGE permission
router.use(requireAuth, requirePermission('ROLE_PERMISSION_MANAGE'));

// GET /admin/stats
router.get('/stats', adminGetStatsController);

// GET /admin/users
router.get('/users', adminGetUsersController);

// POST /admin/users
router.post('/users', adminCreateUserController);

// GET /admin/users/:userId
router.get('/users/:userId', adminGetUserController);

// PATCH /admin/users/:userId
router.patch('/users/:userId', adminUpdateUserController);

// DELETE /admin/users/:userId
router.delete('/users/:userId', adminDeleteUserController);

// GET /admin/users/:userId/sessions
router.get('/users/:userId/sessions', adminGetUserSessionsController);

// POST /admin/users/:userId/revoke-sessions
router.post('/users/:userId/revoke-sessions', adminRevokeUserSessionsController);

// POST /admin/users/:userId/avatar
router.post('/users/:userId/avatar', uploadSingleAvatar, adminUploadUserAvatarController);

// DELETE /admin/users/:userId/avatar
router.delete('/users/:userId/avatar', adminRemoveUserAvatarController);

export default router;
