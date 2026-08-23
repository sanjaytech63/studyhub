import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requirePermission } from '@/middlewares/authorization.middleware';
import { getRolesController } from './role.controller';

const router = Router();
router.get('/roles', requireAuth, requirePermission('ROLE_PERMISSION_MANAGE'), getRolesController);
export default router;
