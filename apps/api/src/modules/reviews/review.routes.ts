import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import {
  getCourseReviewsHandler,
  submitReviewHandler,
  listAdminReviewsHandler,
  moderateReviewHandler,
} from './review.controller';

const router = Router();

// Public course reviews
router.get('/courses/:id/reviews', getCourseReviewsHandler);

// Enrolled student reviews
router.post('/courses/:id/reviews', requireAuth, submitReviewHandler);

// Admin moderation
router.get(
  '/admin/reviews',
  requireAuth,
  requirePermission('course:update'),
  listAdminReviewsHandler,
);
router.patch(
  '/admin/reviews/:id/moderate',
  requireAuth,
  requirePermission('course:update'),
  moderateReviewHandler,
);

export default router;
