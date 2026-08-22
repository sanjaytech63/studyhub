import { logger, logStartupBanner } from './config/logger';
import { redisConnection } from './config/redis';

import { analyticsWorker } from './processors/analytics.processor';
import { certificateWorker } from './processors/certificate.processor';
import { emailWorker } from './processors/email.processor';
import { notificationWorker } from './processors/notification.processor';

const workers = [emailWorker, notificationWorker, certificateWorker, analyticsWorker];

const startWorker = async () => {
  await redisConnection.ping();
  logStartupBanner();
};

const shutdown = async (signal: string) => {
  logger.info(
    {
      signal,
    },
    'Worker shutdown signal received',
  );

  await Promise.all(workers.map((worker) => worker.close()));

  await redisConnection.quit();

  logger.info('StudyHub Worker stopped');

  process.exit(0);
};

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

void startWorker().catch((error) => {
  logger.fatal(
    {
      err: error,
    },
    'Failed to start StudyHub Worker',
  );

  process.exit(1);
});
