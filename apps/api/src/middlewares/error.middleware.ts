import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';
import { ERROR_CODES } from '../errors/error-codes';
import { logger } from '../config/logger';
import { HTTP_STATUS } from '@/utils/http-status';

export const errorMiddleware: ErrorRequestHandler = (error, req, res, _next) => {
  const requestId = res.locals.requestId;

  /*
   * Zod validation errors
   */
  if (error instanceof ZodError) {
    logger.warn(
      {
        requestId,
        method: req.method,
        url: req.originalUrl,
        issues: error.issues,
      },
      'Request validation failed',
    );

    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,

      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Request validation failed.',
        details: error.issues,
        requestId,
      },
    });

    return;
  }

  /*
   * Known application errors
   */
  if (error instanceof AppError) {
    logger.warn(
      {
        err: error,
        requestId,
        method: req.method,
        url: req.originalUrl,
        code: error.code,
        statusCode: error.statusCode,
      },
      'Application error',
    );

    res.status(error.statusCode).json({
      success: false,

      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined
          ? {
              details: error.details,
            }
          : {}),
        requestId,
      },
    });

    return;
  }

  /*
   * Unknown error.
   *
   * Never expose internal implementation
   * details to the client.
   */
  logger.error(
    {
      err: error,
      requestId,
      method: req.method,
      url: req.originalUrl,
    },
    'Unhandled application error',
  );

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: 'Internal server error.',
      requestId,
    },
  });
};
