import { Router } from 'express';

import { requireAuth } from '@/middlewares/auth.middleware';
import { ApiResponse } from '@/utils/api-response';
import { requirePermission } from '@/middlewares/authorization.middleware';

const router = Router();

router.get('/', requireAuth, (req, res) => {
  return ApiResponse.ok(res, {
    userId: req.user?.id,
    sessionId: req.user?.sessionId,
    roleId: req.user?.roleId,
  });
});

router.get('/rbac-test', requireAuth, requirePermission('course:read'), (_req, res) => {
  return ApiResponse.ok(res, {
    message: 'RBAC permission check passed.',
    permission: 'course:read',
  });
});

export default router;
