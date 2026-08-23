import { serverConfig } from '@studyhub/config/server';
import { HTTP_STATUS } from '@/utils/http-status';
import { isPrismaKnownRequestError } from '@/utils/prisma-error';

import { AppError } from '../../errors/app-error';
import { ERROR_CODES } from '../../errors/error-codes';

import {
  createUserWithOtp,
  findLatestPendingOtp,
  findRoleByName,
  findUserByEmail,
  incrementOtpAttempts,
  markOtpExpired,
  blockOtp,
  createSessionWithRefreshToken,
  rotateRefreshToken,
  findRefreshTokenWithSession,
  revokeSessionWithRefreshTokens,
  markEmailVerificationOtpVerified,
} from './auth.repository';

import { generateOtp, hashOtp, verifyOtpHash } from './auth.otp';

import { hashPassword, verifyPassword } from './auth.password';

import type {
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
  ResendOtpInput,
  VerifyEmailOtpInput,
} from './auth.schema';
import {
  createAccessToken,
  createRefreshToken,
  getRefreshTokenExpiration,
  hashRefreshToken,
  verifyRefreshToken,
} from './auth.jwt';
import { getExpirationDate } from '@/utils/duration';
import { prisma } from '@studyhub/database';

/**
 * ============================================================================
 * REGISTER
 * ============================================================================
 */

/**
 * Register a new student account.
 *
 * Flow:
 *
 * 1. Normalize input
 * 2. Check duplicate email
 * 3. Resolve STUDENT role
 * 4. Hash password
 * 5. Generate OTP
 * 6. Hash OTP
 * 7. Create User + OTP atomically
 * 8. Return safe response
 */

export const register = async (input: RegisterInput) => {
  const email = input.email.trim().toLowerCase();

  const firstName = input.firstName.trim();

  const lastName = input.lastName?.trim() || undefined;

  /**
   * Fast duplicate check.
   *
   * This is only an optimization.
   *
   * PostgreSQL UNIQUE(email) remains the final authority.
   */
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.EMAIL_ALREADY_EXISTS,
      'An account with this email already exists.',
    );
  }

  /**
   * Every public registration becomes a STUDENT.
   */
  const studentRole = await findRoleByName('STUDENT');

  if (!studentRole) {
    throw new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      'Default student role is not configured.',
    );
  }

  /**
   * Argon2 must happen outside the DB transaction.
   */
  const passwordHash = await hashPassword(input.password);

  /**
   * Generate verification OTP.
   */
  const otp = generateOtp();

  const codeHash = hashOtp(otp);

  const expiresAt = new Date(Date.now() + serverConfig.otp.expiresIn * 1000);

  try {
    const { user } = await createUserWithOtp({
      user: {
        email,
        passwordHash,
        firstName,

        ...(lastName
          ? {
              lastName,
            }
          : {}),

        role: {
          connect: {
            id: studentRole.id,
          },
        },
      },

      otp: {
        purpose: 'EMAIL_VERIFICATION',
        status: 'PENDING',
        codeHash,
        expiresAt,
      },
    });

    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      requiresEmailVerification: true,

      /**
       * Development only.
       *
       * Never expose OTP in production.
       */
      ...(serverConfig.app.isDevelopment
        ? {
            developmentOtp: otp,
          }
        : {}),
    };
  } catch (error) {
    /**
     * PostgreSQL UNIQUE(email) is the final
     * concurrency protection.
     */
    if (isPrismaKnownRequestError(error) && error.code === 'P2002') {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.EMAIL_ALREADY_EXISTS,
        'An account with this email already exists.',
      );
    }

    throw error;
  }
};

export const login = async (
  input: LoginInput,
  context?: {
    ipAddress?: string;
    userAgent?: string;
  },
) => {
  const email = input.email.trim().toLowerCase();

  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_CREDENTIALS,
      'Invalid email or password.',
    );
  }

  const passwordValid = await verifyPassword(user.passwordHash, input.password);

  if (!passwordValid) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_CREDENTIALS,
      'Invalid email or password.',
    );
  }

  if (user.status !== 'ACTIVE') {
    throw new AppError(HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN, 'Your account is not active.');
  }

  if (!user.emailVerifiedAt) {
    throw new AppError(
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.EMAIL_NOT_VERIFIED,
      'Please verify your email before logging in.',
    );
  }

  const sessionExpiresAt = getRefreshTokenExpiration();

  const session = {
    user: {
      connect: {
        id: user.id,
      },
    },
    status: 'ACTIVE' as const,
    expiresAt: sessionExpiresAt,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  };

  const sessionId = crypto.randomUUID();

  const accessToken = await createAccessToken({
    sub: user.id,
    sessionId,
    roleId: user.roleId,
    type: 'access',
  });

  const refreshToken = await createRefreshToken({
    sub: user.id,
    sessionId,
    type: 'refresh',
  });

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const persisted = await createSessionWithRefreshToken({
    session: {
      id: sessionId,
      ...session,
    },
    refreshToken: {
      user: {
        connect: {
          id: user.id,
        },
      },
      session: {
        connect: {
          id: sessionId,
        },
      },
      tokenHash: refreshTokenHash,
      expiresAt: sessionExpiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
    },
    accessToken,
    refreshToken,
    sessionId: persisted.session.id,
  };
};

export const refreshAccessToken = async (input: RefreshTokenInput) => {
  let payload;

  try {
    payload = await verifyRefreshToken(input.refreshToken);
  } catch {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_REFRESH_TOKEN,
      'Invalid refresh token.',
    );
  }

  const tokenHash = hashRefreshToken(input.refreshToken);

  const storedToken = await findRefreshTokenWithSession(tokenHash);

  if (!storedToken) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_REFRESH_TOKEN,
      'Invalid refresh token.',
    );
  }

  if (storedToken.revokedAt) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_REFRESH_TOKEN,
      'Refresh token has already been revoked.',
    );
  }

  if (storedToken.expiresAt <= new Date()) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_REFRESH_TOKEN,
      'Refresh token has expired.',
    );
  }

  if (storedToken.session.status !== 'ACTIVE' || storedToken.session.expiresAt <= new Date()) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.SESSION_REVOKED,
      'Session is no longer active.',
    );
  }

  if (storedToken.userId !== payload.sub || storedToken.sessionId !== payload.sessionId) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_REFRESH_TOKEN,
      'Invalid refresh token.',
    );
  }

  const newRefreshToken = await createRefreshToken({
    sub: payload.sub,
    sessionId: payload.sessionId,
    type: 'refresh',
  });

  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  const newRefreshTokenExpiresAt = getExpirationDate(serverConfig.jwt.refreshExpiresIn);

  const rotatedToken = await rotateRefreshToken({
    oldTokenId: storedToken.id,
    newToken: {
      user: {
        connect: {
          id: storedToken.userId,
        },
      },
      session: {
        connect: {
          id: storedToken.sessionId,
        },
      },
      tokenHash: newRefreshTokenHash,
      expiresAt: newRefreshTokenExpiresAt,
    },
  });

  if (!rotatedToken) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_REFRESH_TOKEN,
      'Refresh token has already been used.',
    );
  }

  const accessToken = await createAccessToken({
    sub: storedToken.userId,
    sessionId: storedToken.sessionId,
    roleId: storedToken.user.roleId,
    type: 'access',
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    sessionId: storedToken.sessionId,
  };
};

export const logout = async (sessionId: string): Promise<void> => {
  const revoked = await revokeSessionWithRefreshTokens(sessionId);

  if (!revoked) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.SESSION_REVOKED,
      'Session is no longer active.',
    );
  }
};

export const resendEmailVerificationOtp = async (input: ResendOtpInput) => {
  const email = input.email.trim().toLowerCase();

  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, 'Account not found.');
  }

  if (user.emailVerifiedAt) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.EMAIL_ALREADY_EXISTS,
      'Email address is already verified.',
    );
  }

  const otp = generateOtp();
  const codeHash = hashOtp(otp);

  const expiresAt = new Date(Date.now() + serverConfig.otp.expiresIn * 1000);

  await prisma.$transaction(async (tx) => {
    await tx.otpVerification.updateMany({
      where: {
        userId: user.id,
        purpose: 'EMAIL_VERIFICATION',
        status: 'PENDING',
      },
      data: {
        status: 'EXPIRED',
      },
    });

    await tx.otpVerification.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        purpose: 'EMAIL_VERIFICATION',
        status: 'PENDING',
        codeHash,
        expiresAt,
      },
    });
  });

  return {
    email: user.email,
    expiresIn: serverConfig.otp.expiresIn,

    ...(serverConfig.app.isDevelopment
      ? {
          developmentOtp: otp,
        }
      : {}),
  };
};

export const verifyEmailOtp = async (input: VerifyEmailOtpInput) => {
  const email = input.email.trim().toLowerCase();

  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, 'Account not found.');
  }

  if (user.emailVerifiedAt) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.EMAIL_ALREADY_EXISTS,
      'Email address is already verified.',
    );
  }

  const otp = await findLatestPendingOtp(user.id, 'EMAIL_VERIFICATION');

  if (!otp) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_OTP,
      'Invalid or unavailable OTP.',
    );
  }

  const now = new Date();

  if (otp.expiresAt <= now) {
    await markOtpExpired(otp.id);

    throw new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.OTP_EXPIRED, 'OTP has expired.');
  }

  if (otp.attempts >= otp.maxAttempts) {
    await blockOtp(otp.id);

    throw new AppError(
      HTTP_STATUS.TOO_MANY_REQUESTS,
      ERROR_CODES.OTP_TOO_MANY_ATTEMPTS,
      'Too many invalid OTP attempts.',
    );
  }

  const valid = verifyOtpHash(input.otp, otp.codeHash);

  if (!valid) {
    const nextAttempts = otp.attempts + 1;

    await incrementOtpAttempts(otp.id);

    if (nextAttempts >= otp.maxAttempts) {
      await blockOtp(otp.id);

      throw new AppError(
        HTTP_STATUS.TOO_MANY_REQUESTS,
        ERROR_CODES.OTP_TOO_MANY_ATTEMPTS,
        'Too many invalid OTP attempts.',
      );
    }

    throw new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.INVALID_OTP, 'Invalid OTP.');
  }

  const verified = await markEmailVerificationOtpVerified({
    otpId: otp.id,
    userId: user.id,
  });

  if (!verified) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.INVALID_OTP, 'OTP is no longer valid.');
  }

  return {
    userId: user.id,
    email: user.email,
    emailVerified: true,
  };
};
