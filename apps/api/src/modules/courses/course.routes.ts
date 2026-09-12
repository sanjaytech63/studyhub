import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import {
  listCoursesHandler,
  getCourseBySlugHandler,
  listAdminCoursesHandler,
  getAdminCourseByIdHandler,
  createCourseHandler,
  updateCourseHandler,
  publishCourseHandler,
  deleteCourseHandler,
} from './course.controller';

const router = Router();

// Public Course Discovery
router.get('/courses', listCoursesHandler);
router.get('/courses/:slug', getCourseBySlugHandler);

// Admin Operations
router.get(
  '/admin/courses',
  requireAuth,
  requirePermission('course:read'),
  listAdminCoursesHandler,
);
router.get(
  '/admin/courses/:id',
  requireAuth,
  requirePermission('course:read'),
  getAdminCourseByIdHandler,
);
router.post('/admin/courses', requireAuth, requirePermission('course:create'), createCourseHandler);
router.patch(
  '/admin/courses/:id',
  requireAuth,
  requirePermission('course:update'),
  updateCourseHandler,
);
router.post(
  '/admin/courses/:id/publish',
  requireAuth,
  requirePermission('course:publish'),
  publishCourseHandler,
);
router.delete(
  '/admin/courses/:id',
  requireAuth,
  requirePermission('course:delete'),
  deleteCourseHandler,
);

export default router;
