import { Router } from 'express';
import { serverConfig } from '@studyhub/config/server';

import healthRoutes from './health.routes';
import { authRoutes } from '../modules/auth';
import meRouter from './me.routes';
import roleRoutes from '@/modules/roles';
import adminUserRoutes from '@/modules/users/admin-user.routes';

const router = Router();

const apiPrefix = serverConfig.app.apiPrefix;

const registerRoutes = (prefix: string) => {
  router.use(`${prefix}/health`, healthRoutes);
  router.use(`${prefix}/auth`, authRoutes);
  router.use(`${prefix}/me`, meRouter);
  router.use(`${prefix}`, roleRoutes);
  router.use(`${prefix}/admin`, adminUserRoutes);
};

// Register versioned routes (e.g. /api/v1/auth/login)
registerRoutes(apiPrefix);

// Register root routes (e.g. /auth/login) if prefix is configured
if (apiPrefix) {
  registerRoutes('');
}

export default router;
