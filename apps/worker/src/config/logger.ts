import pino from 'pino';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';
import { serverConfig } from '@studyhub/config/server';
import { workerConfig } from './worker.config';

const isDevelopment = serverConfig.app.isDevelopment;

export const logger = pino(
  isDevelopment
    ? {
        level: serverConfig.app.logLevel,

        base: {
          service: 'StudyHub Worker',
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

export const logStartupBanner = () => {
  const { app, concurrency } = workerConfig;

  /**
   * Production
   *
   * Keep production logs structured JSON.
   *
   * Never expose Redis URLs or credentials.
   */
  if (!app.isDevelopment) {
    logger.info(
      {
        service: 'studyhub-worker',
        environment: app.environment,
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

  /**
   * Development
   *
   * Human-friendly startup banner.
   */

  const lines = [
    `🚀  ${chalk.bold.green('STUDYHUB WORKER')}`,

    `Environment   ${chalk.cyan(app.environment)}`,

    `Status        ${chalk.green('● Running')}`,

    `Redis         ${chalk.green('● Connected')}`,

    `Workers       ${chalk.yellow('4')}`,

    `Email         ${chalk.green(`Concurrency ${concurrency.email}`)}`,

    `Notification  ${chalk.green(`Concurrency ${concurrency.notification}`)}`,

    `Certificate   ${chalk.green(`Concurrency ${concurrency.certificate}`)}`,

    `Analytics     ${chalk.green(`Concurrency ${concurrency.analytics}`)}`,
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
