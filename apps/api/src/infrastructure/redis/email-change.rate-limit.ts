import { redis, withRedisTimeout } from './redis.client';

import { AppError } from '@/errors/app-error';
import { ERROR_CODES } from '@/errors/error-codes';
import { HTTP_STATUS } from '@/utils/http-status';

const EMAIL_CHANGE_COOLDOWN_SECONDS = 60;

const getKey = (userId: string) => `rate-limit:email-change:${userId}`;

export const checkEmailChangeRateLimit = async (userId: string): Promise<void> => {
  const key = getKey(userId);

  const acquired = await withRedisTimeout(
    redis.set(key, '1', 'EX', EMAIL_CHANGE_COOLDOWN_SECONDS, 'NX'),
  );

  if (acquired !== 'OK') {
    throw new AppError(
      HTTP_STATUS.TOO_MANY_REQUESTS,
      ERROR_CODES.RATE_LIMITED,
      'Please wait before requesting another email verification OTP.',
    );
  }
};
