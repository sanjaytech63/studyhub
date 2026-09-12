import { Router } from 'express';
import { serverConfig } from '@studyhub/config/server';

import healthRoutes from './health.routes';
import { authRoutes } from '../modules/auth';
import meRouter from './me.routes';
import roleRoutes from '@/modules/roles';
import adminUserRoutes from '@/modules/users/admin-user.routes';
import { categoryRoutes } from '@/modules/categories';
import { courseRoutes } from '@/modules/courses';
import { lessonRoutes } from '@/modules/lessons';
import { enrollmentRoutes } from '@/modules/enrollments';
import { orderRoutes } from '@/modules/orders';
import { paymentRoutes } from '@/modules/payments';
import { couponRoutes } from '@/modules/coupons';
import { certificateRoutes } from '@/modules/certificates';
import { reviewRoutes } from '@/modules/reviews';
import { wishlistRoutes } from '@/modules/wishlist';
import { analyticsRoutes } from '@/modules/analytics';
import mediaRoutes from '@/modules/media/media.routes';

const router = Router();

const apiPrefix = serverConfig.app.apiPrefix;

const registerRoutes = (prefix: string) => {
  router.use(`${prefix}/health`, healthRoutes);
  router.use(`${prefix}/auth`, authRoutes);
  router.use(`${prefix}/me`, meRouter);
  router.use(`${prefix}`, roleRoutes);
  router.use(`${prefix}/admin`, adminUserRoutes);

  // LMS Feature Domains
  router.use(`${prefix}`, categoryRoutes);
  router.use(`${prefix}`, courseRoutes);
  router.use(`${prefix}`, lessonRoutes);
  router.use(`${prefix}`, enrollmentRoutes);
  router.use(`${prefix}`, orderRoutes);
  router.use(`${prefix}`, paymentRoutes);
  router.use(`${prefix}`, couponRoutes);
  router.use(`${prefix}`, certificateRoutes);
  router.use(`${prefix}`, reviewRoutes);
  router.use(`${prefix}`, wishlistRoutes);
  router.use(`${prefix}`, analyticsRoutes);
  router.use(`${prefix}`, mediaRoutes);
};

// Register versioned routes (e.g. /api/v1/courses)
registerRoutes(apiPrefix);

// Register root routes if prefix is configured
if (apiPrefix) {
  registerRoutes('');
}

export default router;
