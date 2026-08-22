import express from 'express';

import { serverConfig } from '@studyhub/config/server';

import { httpLogger } from './config/logger';
import { securityMiddleware } from './config/security';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/not-found.middleware';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import routes from './routes';
import { apiRateLimit } from './middlewares/rate-limit.middleware';

export const createApp = () => {
  const app = express();

  // =========================================================
  // EXPRESS CONFIGURATION
  // =========================================================

  app.disable('x-powered-by');

  app.set('trust proxy', serverConfig.security.trustProxy);

  // =========================================================
  // REQUEST ID
  // =========================================================

  app.use(requestIdMiddleware);

  // =========================================================
  // HTTP LOGGER
  // =========================================================

  app.use(httpLogger);

  // =========================================================
  // RATE LITIMER
  // =========================================================
  app.use(apiRateLimit);

  // =========================================================
  // SECURITY
  // =========================================================

  app.use(...securityMiddleware);

  // =========================================================
  // BODY PARSERS
  // =========================================================

  app.use(
    express.json({
      limit: '1mb',
    }),
  );

  app.use(
    express.urlencoded({
      extended: true,
      limit: '1mb',
    }),
  );

  // =========================================================
  // ROUTES
  // =========================================================

  app.use(routes);

  // =========================================================
  // 404
  // =========================================================

  app.use(notFoundMiddleware);

  // =========================================================
  // GLOBAL ERROR HANDLER
  // =========================================================

  app.use(errorMiddleware);

  return app;
};
