import { serverConfig } from '@studyhub/config/server';

export const workerConfig = Object.freeze({
  app: {
    name: 'StudyHub Worker',
    environment: serverConfig.app.nodeEnv,
    isDevelopment: serverConfig.app.isDevelopment,
    isTest: serverConfig.app.isTest,
    isProduction: serverConfig.app.isProduction,
  },

  redis: {
    url: serverConfig.redis.url,
  },

  concurrency: {
    default: 5,
    email: 5,
    notification: 10,
    certificate: 3,
    analytics: 5,
  },
});

export type WorkerConfig = typeof workerConfig;
