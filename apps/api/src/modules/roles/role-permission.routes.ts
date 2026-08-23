import { Router } from 'express';

import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';

import {
  assignPermissionController,
  getRolePermissionsController,
  removePermissionController,
} from './role-permission.controller';

const router = Router();

router.post(
  '/roles/:roleId/permissions',
  requireAuth,
  requirePermission('ROLE_PERMISSION_MANAGE'),
  assignPermissionController,
);

router.delete(
  '/roles/:roleId/permissions/:permissionId',
  requireAuth,
  requirePermission('ROLE_PERMISSION_MANAGE'),
  removePermissionController,
);

router.get(
  '/roles/:roleId/permissions',
  requireAuth,
  requirePermission('ROLE_PERMISSION_MANAGE'),
  getRolePermissionsController,
);

export default router;
