import http from 'node:http';
import { serverConfig } from '@studyhub/config/server';
import { createApp } from './app';
import { logger, logStartupBanner } from './config/logger';
const app = createApp();
const server = http.createServer(app);
let isShuttingDown = false;

server.listen(serverConfig.app.port, () => {
  logStartupBanner();
});

const shutdown = (signal: string) => {
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

  server.close((error) => {
    if (error) {
      logger.error(
        {
          err: error,
        },
        'Error while shutting down server',
      );

      process.exit(1);
    }

    logger.info('StudyHub API server stopped');

    process.exit(0);
  });
};

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  shutdown('SIGINT');
});
