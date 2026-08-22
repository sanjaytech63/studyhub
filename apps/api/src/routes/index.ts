import { Router } from 'express';
import { serverConfig } from '@studyhub/config/server';
import healthRoutes from './health.routes';

const router = Router();

router.use(`${serverConfig.app.apiPrefix}/health`, healthRoutes);

export default router;
