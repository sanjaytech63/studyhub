import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import { ApiResponse } from '@/utils/api-response';

import {
  getMeController,
  getMySessionsController,
  requestEmailChangeController,
  resendEmailChangeOtpController,
  revokeMyOtherSessionsController,
  revokeMySessionController,
  updateMeController,
  verifyEmailChangeController,
} from '@/modules/users/user.controller';

const router = Router();

router.get('/', requireAuth, getMeController);
router.patch('/', requireAuth, updateMeController);
router.get('/sessions', requireAuth, getMySessionsController);
router.delete('/sessions/:sessionId', requireAuth, revokeMySessionController);
router.delete('/sessions', requireAuth, revokeMyOtherSessionsController);
router.post('/change-email', requireAuth, requestEmailChangeController);
router.post('/verify-email-change', requireAuth, verifyEmailChangeController);
router.post('/change-email/resend', requireAuth, resendEmailChangeOtpController);
router.get('/rbac-test', requireAuth, requirePermission('course:read'), (_req, res) => {
  return ApiResponse.ok(res, {
    message: 'RBAC permission check passed.',
    permission: 'course:read',
  });
});

export default router;
