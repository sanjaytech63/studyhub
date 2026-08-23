import { Router } from 'express';
import { serverConfig } from '@studyhub/config/server';

import healthRoutes from './health.routes';
import { authRoutes } from '../modules/auth';
import meRouter from './me.routes';
import roleRoutes from '@/modules/roles';

const router = Router();

const apiPrefix = serverConfig.app.apiPrefix;

router.use(`${apiPrefix}/health`, healthRoutes);
router.use(`${apiPrefix}/auth`, authRoutes);
router.use(`${apiPrefix}/me`, meRouter);
router.use(`${apiPrefix}`, roleRoutes);

export default router;
