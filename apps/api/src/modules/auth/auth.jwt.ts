import { jwtVerify, SignJWT, type JWTPayload } from 'jose';
import { createHash } from 'node:crypto';
import { serverConfig } from '@studyhub/config/server';
import { getExpirationDate } from '@/utils/duration';
const encoder = new TextEncoder();
const accessSecret = encoder.encode(serverConfig.jwt.accessSecret);
const refreshSecret = encoder.encode(serverConfig.jwt.refreshSecret);

export type AccessTokenPayload = {
  sub: string;
  sessionId: string;
  roleId: string;
  type: 'access';
};

export type RefreshTokenPayload = {
  sub: string;
  sessionId: string;
  type: 'refresh';
};

/**
 * Convert JWT duration strings into seconds.
 *
 * Supported:
 *
 * 30s
 * 15m
 * 1h
 * 7d
 */
const getExpirationSeconds = (value: string): number => {
  const match = value.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(`Invalid JWT expiration format: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2];

  if (!Number.isInteger(amount) || amount <= 0 || !unit) {
    throw new Error(`Invalid JWT expiration value: ${value}`);
  }

  const multiplier: Record<'s' | 'm' | 'h' | 'd', number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };

  if (!(unit in multiplier)) {
    throw new Error(`Unsupported JWT expiration unit: ${unit}`);
  }

  return amount * multiplier[unit as 's' | 'm' | 'h' | 'd'];
};

const getCurrentUnixTime = (): number => {
  return Math.floor(Date.now() / 1000);
};

/**
 * ============================================================================
 * ACCESS TOKEN
 * ============================================================================
 */

export const createAccessToken = async (payload: AccessTokenPayload): Promise<string> => {
  const now = getCurrentUnixTime();

  const expiresIn = getExpirationSeconds(serverConfig.jwt.accessExpiresIn);

  return new SignJWT({
    sessionId: payload.sessionId,
    roleId: payload.roleId,
    type: payload.type,
  })
    .setProtectedHeader({
      alg: 'HS256',
      typ: 'JWT',
    })
    .setSubject(payload.sub)
    .setIssuedAt(now)
    .setExpirationTime(now + expiresIn)
    .sign(accessSecret);
};

/**
 * ============================================================================
 * REFRESH TOKEN
 * ============================================================================
 */

export const createRefreshToken = async (payload: RefreshTokenPayload): Promise<string> => {
  const now = getCurrentUnixTime();

  const expiresIn = getExpirationSeconds(serverConfig.jwt.refreshExpiresIn);

  return new SignJWT({
    sessionId: payload.sessionId,
    type: payload.type,
  })
    .setProtectedHeader({
      alg: 'HS256',
      typ: 'JWT',
    })
    .setSubject(payload.sub)
    .setIssuedAt(now)
    .setExpirationTime(now + expiresIn)
    .sign(refreshSecret);
};

/**
 * ============================================================================
 * ACCESS TOKEN PAYLOAD VALIDATION
 * ============================================================================
 */

const parseAccessTokenPayload = (payload: JWTPayload): AccessTokenPayload => {
  if (
    typeof payload.sub !== 'string' ||
    typeof payload.sessionId !== 'string' ||
    typeof payload.roleId !== 'string' ||
    payload.type !== 'access'
  ) {
    throw new Error('Invalid access token payload.');
  }

  return {
    sub: payload.sub,
    sessionId: payload.sessionId,
    roleId: payload.roleId,
    type: 'access',
  };
};

/**
 * ============================================================================
 * REFRESH TOKEN PAYLOAD VALIDATION
 * ============================================================================
 */

const parseRefreshTokenPayload = (payload: JWTPayload): RefreshTokenPayload => {
  if (
    typeof payload.sub !== 'string' ||
    typeof payload.sessionId !== 'string' ||
    payload.type !== 'refresh'
  ) {
    throw new Error('Invalid refresh token payload.');
  }

  return {
    sub: payload.sub,
    sessionId: payload.sessionId,
    type: 'refresh',
  };
};

/**
 * ============================================================================
 * VERIFY ACCESS TOKEN
 * ============================================================================
 */

export const verifyAccessToken = async (token: string): Promise<AccessTokenPayload> => {
  const { payload } = await jwtVerify(token, accessSecret, {
    algorithms: ['HS256'],
  });

  return parseAccessTokenPayload(payload);
};

/**
 * ============================================================================
 * VERIFY REFRESH TOKEN
 * ============================================================================
 */

export const verifyRefreshToken = async (token: string): Promise<RefreshTokenPayload> => {
  const { payload } = await jwtVerify(token, refreshSecret, {
    algorithms: ['HS256'],
  });

  return parseRefreshTokenPayload(payload);
};

export const hashRefreshToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};

export const getRefreshTokenExpiration = (): Date => {
  return getExpirationDate(serverConfig.jwt.refreshExpiresIn);
};
