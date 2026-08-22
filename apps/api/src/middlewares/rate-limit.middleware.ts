import type { Request, Response } from 'express';

import rateLimit from 'express-rate-limit';

const handleRateLimit = (_req: Request, res: Response) => {
  res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
  });
};

const handleAuthRateLimit = (_req: Request, res: Response) => {
  res.status(429).json({
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again later.',
    },
  });
};

/**
 * General API rate limiter.
 *
 * 300 requests per 15 minutes per client IP.
 */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimit,
});

/**
 * Authentication rate limiter.
 *
 * 20 requests per 15 minutes per client IP.
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleAuthRateLimit,
});
