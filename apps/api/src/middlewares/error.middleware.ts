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
  const isAppError =
    error instanceof AppError ||
    (error &&
      typeof error === 'object' &&
      'statusCode' in error &&
      typeof (error as Record<string, unknown>).statusCode === 'number' &&
      'code' in error);

  if (isAppError) {
    const appErr = error as AppError;
    logger.warn(
      {
        err: appErr,
        requestId,
        method: req.method,
        url: req.originalUrl,
        code: appErr.code,
        statusCode: appErr.statusCode,
      },
      'Application error',
    );

    res.status(appErr.statusCode).json({
      success: false,

      error: {
        code: appErr.code,
        message: appErr.message,
        ...(appErr.details !== undefined
          ? {
              details: appErr.details,
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
