import { Router } from 'express';
import { requireAuth, optionalAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import {
  getLessonContentHandler,
  updateProgressHandler,
  createModuleHandler,
  updateModuleHandler,
  deleteModuleHandler,
  createLessonHandler,
  updateLessonHandler,
  deleteLessonHandler,
} from './lesson.controller';

const router = Router();

// Student Learning
router.get('/lessons/:id/content', optionalAuth, getLessonContentHandler);
router.post('/lessons/:id/progress', requireAuth, updateProgressHandler);

// Admin Curriculum Management (Modules)
router.post('/admin/modules', requireAuth, requirePermission('course:update'), createModuleHandler);
router.patch(
  '/admin/modules/:id',
  requireAuth,
  requirePermission('course:update'),
  updateModuleHandler,
);
router.delete(
  '/admin/modules/:id',
  requireAuth,
  requirePermission('course:update'),
  deleteModuleHandler,
);

// Admin Curriculum Management (Lessons)
router.post('/admin/lessons', requireAuth, requirePermission('course:update'), createLessonHandler);
router.patch(
  '/admin/lessons/:id',
  requireAuth,
  requirePermission('course:update'),
  updateLessonHandler,
);
router.delete(
  '/admin/lessons/:id',
  requireAuth,
  requirePermission('course:update'),
  deleteLessonHandler,
);

export default router;
