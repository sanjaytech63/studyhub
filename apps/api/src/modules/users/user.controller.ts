import type { RequestHandler } from 'express';
import { ApiResponse } from '@/utils/api-response';
import { asyncHandler } from '@/utils/async-handler';
import {
  getMyProfile,
  getMySessions,
  requestEmailChange,
  resendEmailChangeOtp,
  revokeMyOtherSessions,
  revokeMySession,
  updateMyProfile,
  verifyEmailChange,
} from './user.service';
import {
  changeEmailSchema,
  resendEmailChangeOtpSchema,
  updateMeSchema,
  verifyEmailChangeSchema,
} from './user.schema';

export const getMeController: RequestHandler = asyncHandler(async (req, res) => {
  const user = await getMyProfile(req.user!.id);
  return ApiResponse.ok(res, {
    user,
  });
});

export const updateMeController: RequestHandler = asyncHandler(async (req, res) => {
  const input = updateMeSchema.parse(req.body);
  const user = await updateMyProfile(req.user!.id, input);

  return ApiResponse.ok(res, {
    user,
  });
});

export const getMySessionsController: RequestHandler = asyncHandler(async (req, res) => {
  const sessions = await getMySessions(req.user!.id);

  return ApiResponse.ok(res, {
    sessions,
  });
});

export const revokeMySessionController: RequestHandler = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  await revokeMySession(req.user!.id, sessionId as string, req.user!.sessionId);

  return ApiResponse.ok(res, {
    message: 'Session revoked successfully.',
  });
});

export const revokeMyOtherSessionsController: RequestHandler = asyncHandler(async (req, res) => {
  await revokeMyOtherSessions(req.user!.id, req.user!.sessionId);

  return ApiResponse.ok(res, {
    message: 'All other sessions have been revoked.',
  });
});

export const requestEmailChangeController: RequestHandler = asyncHandler(async (req, res) => {
  const input = changeEmailSchema.parse(req.body);
  await requestEmailChange(req.user!.id, input);

  return ApiResponse.ok(res, {
    message: 'A verification OTP has been sent to your new email address.',
  });
});

export const verifyEmailChangeController: RequestHandler = asyncHandler(async (req, res) => {
  const input = verifyEmailChangeSchema.parse(req.body);
  await verifyEmailChange(req.user!.id, req.user!.sessionId, input);

  return ApiResponse.ok(res, {
    message: 'Email address changed successfully.',
  });
});

export const resendEmailChangeOtpController: RequestHandler = asyncHandler(async (req, res) => {
  const input = resendEmailChangeOtpSchema.parse(req.body);
  await resendEmailChangeOtp(req.user!.id, input);

  return ApiResponse.ok(res, {
    message: 'A new verification OTP has been sent.',
  });
});
