import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import { getPermissionsController } from './permission.controller';

const router = Router();

router.get(
  '/permissions',
  requireAuth,
  requirePermission('ROLE_PERMISSION_MANAGE'),
  getPermissionsController,
);

export default router;
