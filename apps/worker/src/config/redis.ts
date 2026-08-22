import IORedis from 'ioredis';

import { serverConfig } from '@studyhub/config/server';

export const redisConnection = new IORedis(serverConfig.redis.url, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: false,
});
