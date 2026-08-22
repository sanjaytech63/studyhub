import { Queue } from 'bullmq';

import { redisConnection } from '../config/redis';
import { QUEUE_NAMES } from './queue.constants';

export const notificationQueue = new Queue(QUEUE_NAMES.NOTIFICATION, {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: 'exponential',
      delay: 3000,
    },

    removeOnComplete: {
      age: 60 * 60 * 24,
      count: 1000,
    },

    removeOnFail: {
      age: 60 * 60 * 24 * 7,
      count: 5000,
    },
  },
});
