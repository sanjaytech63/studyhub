import { Router } from 'express';
import { serverConfig } from '@studyhub/config/server';

import healthRoutes from './health.routes';
import { authRoutes } from '../modules/auth';
import meRouter from './me.routes';
import rolePermissionRoutes from '@/modules/roles/role-permission.routes';

const router = Router();
const apiPrefix = serverConfig.app.apiPrefix;

router.use(`${apiPrefix}/health`, healthRoutes);
router.use(`${apiPrefix}/auth`, authRoutes);
router.use(`${apiPrefix}/me`, meRouter);
router.use(`${apiPrefix}`, rolePermissionRoutes);

export default router;
