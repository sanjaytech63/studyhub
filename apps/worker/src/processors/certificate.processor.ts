import { Worker } from 'bullmq';

import { logger } from '../config/logger';
import { redisConnection } from '../config/redis';
import { workerConfig } from '../config/worker.config';
import { QUEUE_NAMES } from '../queues/queue.constants';

export const certificateWorker = new Worker(
  QUEUE_NAMES.CERTIFICATE,

  async (job) => {
    logger.info(
      {
        jobId: job.id,
        jobName: job.name,
      },
      'Processing certificate job',
    );

    switch (job.name) {
      case 'generate-certificate': {
        logger.info(
          {
            jobId: job.id,
          },
          'Certificate generation job processed',
        );

        return {
          success: true,
        };
      }

      case 'reissue-certificate': {
        logger.info(
          {
            jobId: job.id,
          },
          'Certificate reissue job processed',
        );

        return {
          success: true,
        };
      }

      default:
        throw new Error(`Unsupported certificate job: ${job.name}`);
    }
  },

  {
    connection: redisConnection,

    concurrency: workerConfig.concurrency.certificate,

    autorun: true,
  },
);

certificateWorker.on('completed', (job) => {
  logger.info(
    {
      jobId: job.id,
      queue: QUEUE_NAMES.CERTIFICATE,
    },
    'Certificate job completed',
  );
});

certificateWorker.on('failed', (job, error) => {
  logger.error(
    {
      jobId: job?.id,
      queue: QUEUE_NAMES.CERTIFICATE,
      err: error,
    },
    'Certificate job failed',
  );
});

certificateWorker.on('error', (error) => {
  logger.error(
    {
      err: error,
    },
    'Certificate worker error',
  );
});
