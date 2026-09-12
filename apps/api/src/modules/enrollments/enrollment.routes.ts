import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import {
  getMyCoursesHandler,
  getCourseProgressHandler,
  listAdminEnrollmentsHandler,
  grantEnrollmentHandler,
  updateEnrollmentStatusHandler,
} from './enrollment.controller';

const router = Router();

// Student routes
router.get('/me/courses', requireAuth, getMyCoursesHandler);
router.get('/courses/:id/progress', requireAuth, getCourseProgressHandler);

// Admin operations
router.get(
  '/admin/enrollments',
  requireAuth,
  requirePermission('user:read'),
  listAdminEnrollmentsHandler,
);
router.post(
  '/admin/enrollments/grant',
  requireAuth,
  requirePermission('user:update'),
  grantEnrollmentHandler,
);
router.patch(
  '/admin/enrollments/:id/status',
  requireAuth,
  requirePermission('user:update'),
  updateEnrollmentStatusHandler,
);

export default router;
