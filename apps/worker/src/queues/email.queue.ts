import { Queue } from 'bullmq';

import { redisConnection } from '../config/redis';
import { QUEUE_NAMES } from './queue.constants';

export const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: 'exponential',
      delay: 5000,
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
