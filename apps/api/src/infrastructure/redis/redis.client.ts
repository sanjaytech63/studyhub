import IORedis from 'ioredis';

import { serverConfig } from '@studyhub/config/server';
import { logger } from '@/config/logger';

const REDIS_OPERATION_TIMEOUT_MS = 500;

export const redis = new IORedis(serverConfig.redis.url, {
  maxRetriesPerRequest: 1,
  enableReadyCheck: true,
  lazyConnect: false,
  connectTimeout: 5_000,

  retryStrategy: (times: number): number => {
    return Math.min(times * 250, 2_000);
  },
});

redis.on('connect', () => {
  logger.info('Redis connection established');
});

redis.on('ready', () => {
  logger.info('Redis client ready');
});

redis.on('error', (error: Error) => {
  logger.error(
    {
      error,
    },
    'Redis connection error',
  );
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

redis.on('reconnecting', (delay: number) => {
  logger.warn(
    {
      delay,
    },
    'Redis reconnecting',
  );
});

export const withRedisTimeout = async <T>(
  operation: Promise<T>,
  timeoutMs: number = REDIS_OPERATION_TIMEOUT_MS,
): Promise<T> => {
  let timeout: NodeJS.Timeout | undefined;

  try {
    return await Promise.race([
      operation,
      new Promise<T>((_, reject) => {
        timeout = setTimeout(() => {
          reject(new Error(`Redis operation timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
};
