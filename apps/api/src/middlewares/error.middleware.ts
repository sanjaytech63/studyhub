import type { ErrorRequestHandler } from 'express';
import { serverConfig } from '@studyhub/config/server';
import { logger } from '../config/logger';

export const errorMiddleware: ErrorRequestHandler = (error, req, res, _next) => {
  const requestId = res.locals.requestId;
  const statusCode = typeof error?.statusCode === 'number' ? error.statusCode : 500;
  const isProduction = serverConfig.app.isProduction;

  logger.error(
    {
      err: error,
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode,
    },
    'Unhandled application error',
  );

  const message = isProduction
    ? 'Internal server error'
    : error instanceof Error
      ? error.message
      : 'Internal server error';

  res.status(statusCode).json({
    success: false,

    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
      requestId,
    },
  });
};
