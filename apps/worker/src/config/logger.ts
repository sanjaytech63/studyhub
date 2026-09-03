import pino from 'pino';

import { serverConfig } from '@studyhub/config/server';

const isDevelopment = serverConfig.app.isDevelopment;

export const logger = pino(
  isDevelopment
    ? {
        level: serverConfig.app.logLevel,

        base: {
          service: 'studyhub-worker',
          environment: serverConfig.app.nodeEnv,
        },

        timestamp: pino.stdTimeFunctions.isoTime,

        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            singleLine: true,
            ignore: 'pid,hostname',
          },
        },
      }
    : {
        level: serverConfig.app.logLevel,

        base: {
          service: 'studyhub-worker',
          environment: serverConfig.app.nodeEnv,
        },

        timestamp: pino.stdTimeFunctions.isoTime,
      },
);

export const logStartupBanner = async (): Promise<void> => {
  const { app } = serverConfig;

  if (!app.isDevelopment) {
    logger.info(
      {
        service: 'studyhub-worker',
        environment: app.nodeEnv,
        workers: 4,
        queues: [
          'studyhub-email',
          'studyhub-notification',
          'studyhub-certificate',
          'studyhub-analytics',
        ],
      },
      'StudyHub Worker started',
    );

    return;
  }

  const { logDevelopmentBanner } = await import('./development-banner.js');

  logDevelopmentBanner();
};
