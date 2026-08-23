import type { RequestHandler } from 'express';
import { ApiResponse } from '@/utils/api-response';
import { asyncHandler } from '@/utils/async-handler';
import {
  refreshTokenSchema,
  registerSchema,
  resendOtpSchema,
  verifyEmailOtpSchema,
} from './auth.schema';
import {
  logout,
  refreshAccessToken,
  register,
  resendEmailVerificationOtp,
  verifyEmailOtp,
} from './auth.service';
import { loginSchema } from './auth.schema';
import { login } from './auth.service';
import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';

export const registerController: RequestHandler = asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  const result = await register(input);
  return ApiResponse.created(res, result);
});

export const loginController: RequestHandler = asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const result = await login(input, {
    ipAddress: req.ip,
    userAgent: req.get('user-agent') ?? undefined,
  });
  return ApiResponse.ok(res, result);
});

export const refreshTokenController: RequestHandler = asyncHandler(async (req, res) => {
  const input = refreshTokenSchema.parse(req.body);
  const result = await refreshAccessToken(input);
  return ApiResponse.ok(res, result);
});

export const logoutController: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      'Authentication required.',
    );
  }

  await logout(req.user.sessionId);
  return ApiResponse.noContent(res);
});

export const resendOtpController: RequestHandler = asyncHandler(async (req, res) => {
  const input = resendOtpSchema.parse(req.body);
  const result = await resendEmailVerificationOtp(input);
  return ApiResponse.ok(res, result);
});

export const verifyEmailOtpController: RequestHandler = asyncHandler(async (req, res) => {
  const input = verifyEmailOtpSchema.parse(req.body);
  const result = await verifyEmailOtp(input);
  return ApiResponse.ok(res, result);
});
