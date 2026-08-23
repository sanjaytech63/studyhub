import http from 'node:http';
import { connectDatabase, disconnectDatabase } from '@studyhub/database';
import { serverConfig } from '@studyhub/config/server';

import { createApp } from './app';
import { logger, logStartupBanner } from './config/logger';

const app = createApp();
const server = http.createServer(app);

let isShuttingDown = false;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    logger.info('Database connection established');

    server.listen(serverConfig.app.port, () => {
      logStartupBanner();
    });
  } catch (error) {
    logger.fatal(
      {
        err: error,
      },
      'Failed to start StudyHub API',
    );

    process.exit(1);
  }
};

const shutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) {
    logger.warn(
      {
        signal,
      },
      'Shutdown already in progress',
    );

    return;
  }

  isShuttingDown = true;

  logger.info(
    {
      signal,
    },
    'Shutdown signal received',
  );

  server.close(async (error) => {
    if (error) {
      logger.error(
        {
          err: error,
        },
        'Error while shutting down server',
      );

      try {
        await disconnectDatabase();
      } finally {
        process.exit(1);
      }
    }

    try {
      await disconnectDatabase();

      logger.info('Database connection closed');

      logger.info('StudyHub API server stopped');

      process.exit(0);
    } catch (disconnectError) {
      logger.error(
        {
          err: disconnectError,
        },
        'Error while disconnecting database',
      );

      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

void startServer();
