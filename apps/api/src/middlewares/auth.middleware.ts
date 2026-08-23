import type { RequestHandler } from 'express';

import { HTTP_STATUS } from '@/utils/http-status';
import { AppError } from '@/errors/app-error';
import { ERROR_CODES } from '@/errors/error-codes';

import { verifyAccessToken } from '@/modules/auth/auth.jwt';
import { findSessionById } from '@/modules/auth/auth.repository';

export type AuthenticatedUser = {
  id: string;
  sessionId: string;
  roleId: string;
};

const extractBearerToken = (authorization?: string): string => {
  if (!authorization) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      'Authentication required.',
    );
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      'Invalid authorization header.',
    );
  }

  return token;
};

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  let payload;

  try {
    payload = await verifyAccessToken(token);
  } catch {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      'Invalid or expired access token.',
    );
  }

  const session = await findSessionById(payload.sessionId);

  if (!session) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_REFRESH_TOKEN,
      'Session not found.',
    );
  }

  if (session.userId !== payload.sub) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      'Invalid authentication session.',
    );
  }

  if (session.status !== 'ACTIVE') {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.SESSION_REVOKED,
      'Session is no longer active.',
    );
  }

  if (session.expiresAt <= new Date()) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.SESSION_REVOKED,
      'Session has expired.',
    );
  }

  req.user = {
    id: payload.sub,
    sessionId: payload.sessionId,
    roleId: payload.roleId,
  };

  next();
};
