import chalk from 'chalk';
import stripAnsi from 'strip-ansi';
import { workerConfig } from './worker.config.js';

export const logDevelopmentBanner = (): void => {
  const { app, concurrency } = workerConfig;

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
