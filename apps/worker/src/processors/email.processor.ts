import { Worker } from 'bullmq';

import { logger } from '../config/logger';
import { redisConnection } from '../config/redis';
import { workerConfig } from '../config/worker.config';
import { QUEUE_NAMES } from '../queues/queue.constants';

export const emailWorker = new Worker(
  QUEUE_NAMES.EMAIL,

  async (job) => {
    logger.info(
      {
        jobId: job.id,
        jobName: job.name,
      },
      'Processing email job',
    );

    switch (job.name) {
      case 'send-email': {
        logger.info(
          {
            jobId: job.id,
          },
          'Email job processed',
        );

        return {
          success: true,
        };
      }

      default:
        throw new Error(`Unsupported email job: ${job.name}`);
    }
  },

  {
    connection: redisConnection,

    concurrency: workerConfig.concurrency.email,

    autorun: true,
  },
);

emailWorker.on('completed', (job) => {
  logger.info(
    {
      jobId: job.id,
      queue: QUEUE_NAMES.EMAIL,
    },
    'Email job completed',
  );
});

emailWorker.on('failed', (job, error) => {
  logger.error(
    {
      jobId: job?.id,
      queue: QUEUE_NAMES.EMAIL,
      err: error,
    },
    'Email job failed',
  );
});

emailWorker.on('error', (error) => {
  logger.error(
    {
      err: error,
    },
    'Email worker error',
  );
});
