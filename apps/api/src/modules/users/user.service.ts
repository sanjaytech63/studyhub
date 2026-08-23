import { AppError } from '@/errors/app-error';
import { ERROR_CODES } from '@/errors/error-codes';
import { HTTP_STATUS } from '@/utils/http-status';

import {
  completeEmailChange,
  findActiveSessionsByUserId,
  findUserByEmail,
  findUserProfileById,
  revokeOtherUserSessions,
  revokeUserSession,
  updateUserProfile,
} from './user.repository';

import type {
  ChangeEmailInput,
  ResendEmailChangeOtpInput,
  UpdateMeInput,
  VerifyEmailChangeInput,
} from './user.schema';
import { generateOtp, getOtpExpiration, hashOtp, verifyOtpHash } from '../auth/auth.otp';
import {
  blockOtpVerification,
  createOtpVerification,
  expirePendingEmailChangeOtps,
  findLatestPendingEmailChangeOtp,
  incrementOtpAttempts,
} from '../auth/auth.repository';
import { sendEmailChangeOtpEmail } from '../auth/auth.email';
import { checkEmailChangeRateLimit } from '@/infrastructure/redis/email-change.rate-limit';

export const getMyProfile = async (userId: string) => {
  const user = await findUserProfileById(userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'User not found.');
  }

  return user;
};

export const updateMyProfile = async (userId: string, input: UpdateMeInput) => {
  const user = await findUserProfileById(userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'User not found.');
  }

  return updateUserProfile(userId, {
    firstName: input.firstName,
    lastName: input.lastName,
  });
};

export const getMySessions = async (userId: string) => {
  return findActiveSessionsByUserId(userId);
};

export const revokeMySession = async (
  userId: string,
  sessionId: string,
  currentSessionId: string,
): Promise<void> => {
  if (sessionId === currentSessionId) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_REQUEST,
      'Use logout to terminate the current session.',
    );
  }

  const revoked = await revokeUserSession(userId, sessionId);

  if (!revoked) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Session not found.');
  }
};

export const revokeMyOtherSessions = async (
  userId: string,
  currentSessionId: string,
): Promise<void> => {
  await revokeOtherUserSessions(userId, currentSessionId);
};

export const requestEmailChange = async (
  userId: string,
  input: ChangeEmailInput,
): Promise<void> => {
  await checkEmailChangeRateLimit(userId);

  const newEmail = input.newEmail.trim().toLowerCase();

  const existingUser = await findUserByEmail(newEmail);

  if (existingUser) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.CONFLICT,
      'Email address is already in use.',
    );
  }

  await expirePendingEmailChangeOtps(userId);

  const otp = generateOtp();
  const codeHash = hashOtp(otp);

  await createOtpVerification({
    userId,
    purpose: 'EMAIL_CHANGE',
    codeHash,
    targetEmail: newEmail,
    expiresAt: getOtpExpiration(),
  });

  await sendEmailChangeOtpEmail({
    email: newEmail,
    otp,
  });
};

export const verifyEmailChange = async (
  userId: string,
  sessionId: string,
  input: VerifyEmailChangeInput,
): Promise<void> => {
  const otpRecord = await findLatestPendingEmailChangeOtp(userId);

  if (!otpRecord) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.INVALID_OTP, 'Invalid or expired OTP.');
  }

  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    await blockOtpVerification(otpRecord.id);

    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_OTP,
      'OTP attempt limit exceeded.',
    );
  }

  const valid = verifyOtpHash(input.otp, otpRecord.codeHash);

  if (!valid) {
    const nextAttempts = otpRecord.attempts + 1;
    await incrementOtpAttempts(otpRecord.id);

    if (nextAttempts >= otpRecord.maxAttempts) {
      await blockOtpVerification(otpRecord.id);
    }
    throw new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.INVALID_OTP, 'Invalid or expired OTP.');
  }

  if (!otpRecord.targetEmail) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_REQUEST,
      'Email change request is invalid.',
    );
  }

  const existingUser = await findUserByEmail(otpRecord.targetEmail);

  if (existingUser && existingUser.id !== userId) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.CONFLICT,
      'Email address is already in use.',
    );
  }

  await completeEmailChange(userId, otpRecord.id, otpRecord.targetEmail);

  await revokeOtherUserSessions(userId, sessionId);
};

export const resendEmailChangeOtp = async (
  userId: string,
  input: ResendEmailChangeOtpInput,
): Promise<void> => {
  await checkEmailChangeRateLimit(userId);

  const newEmail = input.newEmail.trim().toLowerCase();

  const existingUser = await findUserByEmail(newEmail);

  if (existingUser) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.CONFLICT,
      'Email address is already in use.',
    );
  }

  await expirePendingEmailChangeOtps(userId);

  const otp = generateOtp();
  const codeHash = hashOtp(otp);

  await createOtpVerification({
    userId,
    purpose: 'EMAIL_CHANGE',
    codeHash,
    targetEmail: newEmail,
    expiresAt: getOtpExpiration(),
  });

  await sendEmailChangeOtpEmail({
    email: newEmail,
    otp,
  });
};
