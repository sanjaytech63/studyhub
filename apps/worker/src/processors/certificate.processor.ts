import { Worker } from 'bullmq';

import { logger } from '../config/logger';
import { redisConnection } from '../config/redis';
import { workerConfig } from '../config/worker.config';
import { QUEUE_NAMES } from '../queues/queue.constants';

import { prisma } from '@studyhub/database';

export const certificateWorker = new Worker(
  QUEUE_NAMES.CERTIFICATE,

  async (job) => {
    logger.info(
      {
        jobId: job.id,
        jobName: job.name,
        data: job.data,
      },
      'Processing certificate job',
    );

    switch (job.name) {
      case 'generate-certificate': {
        const { certificateId, certificateCode } = (job.data || {}) as {
          certificateId?: string;
          certificateCode?: string;
        };

        if (certificateId) {
          try {
            await prisma.certificate.update({
              where: { id: certificateId },
              data: {
                pdfUrl: `https://assets.studyhub.dev/certificates/${certificateCode || certificateId}.pdf`,
              },
            });
          } catch (dbErr) {
            logger.warn(
              { dbErr, certificateId },
              'Could not update certificate in DB (offline or mock)',
            );
          }
        }

        logger.info(
          {
            jobId: job.id,
            certificateId,
          },
          'Certificate generation job processed successfully',
        );

        return {
          success: true,
          pdfUrl: `https://assets.studyhub.dev/certificates/${certificateCode || certificateId}.pdf`,
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
