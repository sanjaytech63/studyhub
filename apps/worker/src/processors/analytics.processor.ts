import { Worker } from 'bullmq';

import { logger } from '../config/logger';
import { redisConnection } from '../config/redis';
import { workerConfig } from '../config/worker.config';
import { QUEUE_NAMES } from '../queues/queue.constants';

export const analyticsWorker = new Worker(
  QUEUE_NAMES.ANALYTICS,

  async (job) => {
    logger.info(
      {
        jobId: job.id,
        jobName: job.name,
      },
      'Processing analytics job',
    );

    switch (job.name) {
      case 'track-event': {
        logger.info(
          {
            jobId: job.id,
          },
          'Analytics event processed',
        );

        return {
          success: true,
        };
      }

      case 'aggregate-course-analytics': {
        logger.info(
          {
            jobId: job.id,
          },
          'Course analytics aggregation processed',
        );

        return {
          success: true,
        };
      }

      case 'aggregate-platform-analytics': {
        logger.info(
          {
            jobId: job.id,
          },
          'Platform analytics aggregation processed',
        );

        return {
          success: true,
        };
      }

      default:
        throw new Error(`Unsupported analytics job: ${job.name}`);
    }
  },

  {
    connection: redisConnection,

    concurrency: workerConfig.concurrency.analytics,

    autorun: true,
  },
);

analyticsWorker.on('completed', (job) => {
  logger.info(
    {
      jobId: job.id,
      queue: QUEUE_NAMES.ANALYTICS,
    },
    'Analytics job completed',
  );
});

analyticsWorker.on('failed', (job, error) => {
  logger.error(
    {
      jobId: job?.id,
      queue: QUEUE_NAMES.ANALYTICS,
      err: error,
    },
    'Analytics job failed',
  );
});

analyticsWorker.on('error', (error) => {
  logger.error(
    {
      err: error,
    },
    'Analytics worker error',
  );
});
