import type { RequestHandler } from 'express';

import { AppError } from '@/errors/app-error';
import { ERROR_CODES } from '@/errors/error-codes';
import { HTTP_STATUS } from '@/utils/http-status';

import { ApiResponse } from '@/utils/api-response';
import { asyncHandler } from '@/utils/async-handler';

import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyEmailOtpSchema,
} from './auth.schema';

import {
  changePassword,
  forgotPassword,
  login,
  logout,
  refreshAccessToken,
  register,
  resendEmailVerificationOtp,
  resetPassword,
  verifyEmailOtp,
} from './auth.service';

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

export const forgotPasswordController: RequestHandler = asyncHandler(async (req, res) => {
  const { email } = forgotPasswordSchema.parse(req.body);

  await forgotPassword(email);

  return ApiResponse.ok(res, {
    message: 'If an account exists with that email, a password reset OTP has been sent.',
  });
});

export const resetPasswordController: RequestHandler = asyncHandler(async (req, res) => {
  const input = resetPasswordSchema.parse(req.body);

  await resetPassword(input);

  return ApiResponse.ok(res, {
    message: 'Password has been reset successfully.',
  });
});

export const changePasswordController: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      'Authentication required.',
    );
  }

  const input = changePasswordSchema.parse(req.body);

  await changePassword(req.user.id, req.user.sessionId, input);

  return ApiResponse.ok(res, {
    message: 'Password changed successfully.',
  });
});
