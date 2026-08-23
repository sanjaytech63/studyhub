import IORedis from 'ioredis';
import { serverConfig } from '@studyhub/config/server';

export const redisConnection = new IORedis(serverConfig.redis.url, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: false,
  connectTimeout: 5_000,
  retryStrategy: (times: number): number => {
    return Math.min(times * 250, 2_000);
  },
});
