import { Worker } from 'bullmq';

import { logger } from '../config/logger';
import { redisConnection } from '../config/redis';
import { workerConfig } from '../config/worker.config';
import { QUEUE_NAMES } from '../queues/queue.constants';

export const notificationWorker = new Worker(
  QUEUE_NAMES.NOTIFICATION,

  async (job) => {
    logger.info(
      {
        jobId: job.id,
        jobName: job.name,
      },
      'Processing notification job',
    );

    switch (job.name) {
      case 'create-notification': {
        logger.info(
          {
            jobId: job.id,
          },
          'Notification job processed',
        );

        return {
          success: true,
        };
      }

      case 'send-push-notification': {
        logger.info(
          {
            jobId: job.id,
          },
          'Push notification job processed',
        );

        return {
          success: true,
        };
      }

      default:
        throw new Error(`Unsupported notification job: ${job.name}`);
    }
  },

  {
    connection: redisConnection,

    concurrency: workerConfig.concurrency.notification,

    autorun: true,
  },
);

notificationWorker.on('completed', (job) => {
  logger.info(
    {
      jobId: job.id,
      queue: QUEUE_NAMES.NOTIFICATION,
    },
    'Notification job completed',
  );
});

notificationWorker.on('failed', (job, error) => {
  logger.error(
    {
      jobId: job?.id,
      queue: QUEUE_NAMES.NOTIFICATION,
      err: error,
    },
    'Notification job failed',
  );
});

notificationWorker.on('error', (error) => {
  logger.error(
    {
      err: error,
    },
    'Notification worker error',
  );
});
