import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import { getAdminAnalyticsHandler } from './analytics.controller';

const router = Router();

router.get(
  '/admin/analytics',
  requireAuth,
  requirePermission('user:read'),
  getAdminAnalyticsHandler,
);

export default router;
