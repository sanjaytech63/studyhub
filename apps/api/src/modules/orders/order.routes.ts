import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import { createOrderHandler, getMyOrdersHandler, listAdminOrdersHandler } from './order.controller';

const router = Router();

router.post('/orders', requireAuth, createOrderHandler);
router.get('/me/orders', requireAuth, getMyOrdersHandler);

router.get('/admin/orders', requireAuth, requirePermission('order:read'), listAdminOrdersHandler);

export default router;
