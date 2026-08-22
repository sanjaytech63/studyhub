import { Queue } from 'bullmq';

import { redisConnection } from '../config/redis';
import { QUEUE_NAMES } from './queue.constants';

export const analyticsQueue = new Queue(QUEUE_NAMES.ANALYTICS, {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: 'exponential',
      delay: 10000,
    },

    removeOnComplete: {
      age: 60 * 60 * 24,
      count: 2000,
    },

    removeOnFail: {
      age: 60 * 60 * 24 * 14,
      count: 10000,
    },
  },
});
