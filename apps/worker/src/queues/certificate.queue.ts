import { Queue } from 'bullmq';

import { redisConnection } from '../config/redis';
import { QUEUE_NAMES } from './queue.constants';

export const certificateQueue = new Queue(QUEUE_NAMES.CERTIFICATE, {
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
      age: 60 * 60 * 24 * 30,
      count: 5000,
    },
  },
});
