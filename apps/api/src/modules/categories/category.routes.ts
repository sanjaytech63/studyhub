import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import {
  listCategoriesHandler,
  getCategoryHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from './category.controller';

const router = Router();

// Public
router.get('/categories', listCategoriesHandler);
router.get('/categories/:slug', getCategoryHandler);

// Admin
router.post(
  '/admin/categories',
  requireAuth,
  requirePermission('course:create'),
  createCategoryHandler,
);
router.patch(
  '/admin/categories/:id',
  requireAuth,
  requirePermission('course:update'),
  updateCategoryHandler,
);
router.delete(
  '/admin/categories/:id',
  requireAuth,
  requirePermission('course:delete'),
  deleteCategoryHandler,
);

export default router;
