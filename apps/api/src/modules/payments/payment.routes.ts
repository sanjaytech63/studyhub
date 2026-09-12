import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import {
  createCheckoutSessionHandler,
  verifyPaymentHandler,
  listAdminPaymentsHandler,
} from './payment.controller';

const router = Router();

router.post('/payments/create-checkout-session', requireAuth, createCheckoutSessionHandler);
router.post('/payments/verify', requireAuth, verifyPaymentHandler);

router.get(
  '/admin/payments',
  requireAuth,
  requirePermission('payment:read'),
  listAdminPaymentsHandler,
);

export default router;
