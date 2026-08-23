import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import {
  createRoleController,
  deleteRoleController,
  getRoleController,
  getRolesController,
  updateRoleController,
} from './role.controller';

const router = Router();

router.get('/roles', requireAuth, requirePermission('ROLE_PERMISSION_MANAGE'), getRolesController);
router.get(
  '/roles/:roleId',
  requireAuth,
  requirePermission('ROLE_PERMISSION_MANAGE'),
  getRoleController,
);

router.post(
  '/roles',
  requireAuth,
  requirePermission('ROLE_PERMISSION_MANAGE'),
  createRoleController,
);

router.patch(
  '/roles/:roleId',
  requireAuth,
  requirePermission('ROLE_PERMISSION_MANAGE'),
  updateRoleController,
);

router.delete(
  '/roles/:roleId',
  requireAuth,
  requirePermission('ROLE_PERMISSION_MANAGE'),
  deleteRoleController,
);

export default router;
