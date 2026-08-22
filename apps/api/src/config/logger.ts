import pino from 'pino';
import pinoHttp from 'pino-http';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

import { serverConfig } from '@studyhub/config/server';

const isDevelopment = serverConfig.app.isDevelopment;

export const logger = pino(
  isDevelopment
    ? {
        level: serverConfig.app.logLevel,

        base: {
          service: 'StudyHub API',
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
          service: 'studyhub-api',
          environment: serverConfig.app.nodeEnv,
        },

        timestamp: pino.stdTimeFunctions.isoTime,
      },
);

export const httpLogger = pinoHttp({
  logger,

  customProps: (_req, res) => ({
    requestId: res.getHeader('x-request-id'),
  }),

  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      remoteAddress: req.ip,
    }),

    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

export const logStartupBanner = () => {
  const { app } = serverConfig;

  /**
   * Production
   *
   * Keep production logs structured JSON.
   */
  if (!app.isDevelopment) {
    logger.info(
      {
        service: 'studyhub-api',
        environment: app.nodeEnv,
        port: app.port,
        apiUrl: app.apiUrl,
        apiPrefix: app.apiPrefix,
      },
      'StudyHub API server started',
    );

    return;
  }

  /**
   * Development
   *
   * Human-friendly startup banner.
   */
  const lines = [
    `🚀  ${chalk.bold.green('STUDYHUB API')}`,

    `Environment   ${chalk.cyan(app.nodeEnv)}`,

    `Status        ${chalk.green('● Running')}`,

    `Server        ${chalk.blue(app.apiUrl)}`,

    `API           ${chalk.blue(`${app.apiUrl}${app.apiPrefix}`)}`,

    `Health        ${chalk.blue(`${app.apiUrl}${app.apiPrefix}/health`)}`,
  ];

  const rows = lines.map((line) => ({
    line,
    visibleLine: stripAnsi(line),
  }));

  const maxLen = Math.max(...rows.map(({ visibleLine }) => visibleLine.length));

  const top = `╭${'─'.repeat(maxLen + 2)}╮`;

  const bottom = `╰${'─'.repeat(maxLen + 2)}╯`;

  // eslint-disable-next-line no-console
  const print = console.log;

  print('');
  print(chalk.gray(top));

  for (const { line, visibleLine } of rows) {
    const padding = ' '.repeat(maxLen - visibleLine.length);

    print(chalk.gray('│ ') + line + padding + chalk.gray(' │'));
  }

  print(chalk.gray(bottom));
  print('');
};
