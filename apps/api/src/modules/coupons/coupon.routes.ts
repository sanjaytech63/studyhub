import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import {
  validateCouponHandler,
  listAdminCouponsHandler,
  createCouponHandler,
  updateCouponHandler,
} from './coupon.controller';

const router = Router();

// Student can validate coupon before checkout
router.post('/coupons/validate', requireAuth, validateCouponHandler);

// Admin operations
router.get('/admin/coupons', requireAuth, requirePermission('order:read'), listAdminCouponsHandler);
router.post('/admin/coupons', requireAuth, requirePermission('order:read'), createCouponHandler);
router.patch(
  '/admin/coupons/:id',
  requireAuth,
  requirePermission('order:read'),
  updateCouponHandler,
);

export default router;
