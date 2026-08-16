import { spawnSync } from 'node:child_process';

const npmCli = process.env.npm_execpath;

if (!npmCli) {
  console.error('Unable to locate npm CLI.');
  process.exit(1);
}

/*
 * =========================================================
 * ENVIRONMENT
 * =========================================================
 */

const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

const isWindows = process.platform === 'win32';

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',

  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
};

function colorize(color, value) {
  if (isCI) {
    return value;
  }

  return `${colors[color]}${value}${colors.reset}`;
}

/*
 * =========================================================
 * CHECKS
 * =========================================================
 */

const checks = [
  {
    name: 'TypeScript',
    description: 'Checking types across all workspaces',
    command: ['run', 'typecheck'],
  },

  {
    name: 'ESLint',
    description: 'Checking code quality and lint rules',
    command: ['run', 'lint'],
  },

  {
    name: 'Prettier',
    description: 'Checking project formatting',
    command: ['run', 'format:check'],
  },

  {
    name: 'Tests',
    description: 'Running workspace test suites',
    command: ['test'],
  },

  {
    name: 'Production Build',
    description: 'Creating production builds',
    command: ['run', 'build'],
  },
];

/*
 * =========================================================
 * TERMINAL HELPERS
 * =========================================================
 */

function printLine(char = '─', length = 64) {
  console.log(char.repeat(length));
}

function printHeader() {
  console.log('');

  printLine('═');

  console.log(colorize('cyan', colorize('bold', '  STUDYHUB · PRODUCTION QUALITY CHECK')));

  console.log(
    colorize('gray', `  Node ${process.version} · ${process.platform} · ${isCI ? 'CI' : 'Local'}`),
  );

  printLine('═');

  console.log('');
}

function printCheckHeader(index, total, check) {
  console.log(`${colorize('cyan', `[${index}/${total}]`)} ${colorize('bold', check.name)}`);

  console.log(`      ${colorize('gray', check.description)}`);

  console.log(`      ${colorize('dim', `$ npm ${check.command.join(' ')}`)}`);

  console.log('');
}

function printSuccess(check, duration) {
  console.log(
    `      ${colorize('green', '✔')} ${colorize('green', 'PASSED')} ${colorize(
      'gray',
      `(${duration}s)`,
    )}`,
  );

  console.log('');
}

function printFailure(check, duration, exitCode) {
  console.log(
    `      ${colorize('red', '✖')} ${colorize('red', 'FAILED')} ${colorize(
      'gray',
      `(${duration}s)`,
    )}`,
  );

  console.log(`      ${colorize('red', `Exit code: ${exitCode ?? 'unknown'}`)}`);

  console.log('');
}

function printSkipped(check) {
  console.log(`      ${colorize('yellow', '○')} ${colorize('yellow', 'SKIPPED')} ${check.name}`);
}

/*
 * =========================================================
 * COMMAND EXECUTION
 * =========================================================
 */

function runCommand(args) {
  const startedAt = Date.now();

  const result = spawnSync(process.execPath, [npmCli, ...args], {
    stdio: 'inherit',

    /*
     * npm CLI must be executed directly through Node.
     * This avoids npm.cmd EINVAL issues on Windows.
     */
    shell: false,

    windowsHide: false,

    env: {
      ...process.env,
      FORCE_COLOR: isCI ? '0' : '1',
    },
  });

  const duration = ((Date.now() - startedAt) / 1000).toFixed(1);

  if (result.error) {
    console.error('');

    console.error(colorize('red', colorize('bold', 'Command execution failed:')));

    console.error(colorize('red', result.error.message));

    console.error('');
  }

  return {
    success: result.status === 0 && !result.error,

    exitCode: result.status,

    signal: result.signal,

    duration,
  };
}

/*
 * =========================================================
 * SUMMARY
 * =========================================================
 */

function printSummary(results, totalDuration) {
  console.log('');

  printLine('═');

  console.log(colorize('bold', '  QUALITY CHECK SUMMARY'));

  printLine('─');

  for (const result of results) {
    const isSkipped = result.skipped === true;

    const icon = isSkipped
      ? colorize('yellow', '○')
      : result.success
        ? colorize('green', '✔')
        : colorize('red', '✖');

    const status = isSkipped
      ? colorize('yellow', 'SKIPPED')
      : result.success
        ? colorize('green', 'PASSED')
        : colorize('red', 'FAILED');

    console.log(
      `  ${icon} ${result.name.padEnd(20)} ${status.padEnd(12)} ${colorize(
        'gray',
        `${result.duration}s`,
      )}`,
    );
  }

  printLine('─');

  console.log(`  ${colorize('bold', 'Total time')}: ${colorize('gray', `${totalDuration}s`)}`);

  console.log('');

  const failed = results.filter((result) => !result.success);

  if (failed.length === 0) {
    printLine('═');

    console.log(colorize('green', colorize('bold', '  ✔ ALL QUALITY CHECKS PASSED')));

    console.log(colorize('gray', '  The project is ready for commit/push.'));

    printLine('═');
  } else {
    printLine('═');

    console.log(colorize('red', colorize('bold', '  ✖ QUALITY CHECK FAILED')));

    console.log(colorize('yellow', '  Fix the issue above and run npm run verify again.'));

    printLine('═');
  }

  console.log('');
}

/*
 * =========================================================
 * MAIN
 * =========================================================
 */

function main() {
  const startedAt = Date.now();

  printHeader();

  const results = [];

  for (let index = 0; index < checks.length; index += 1) {
    const check = checks[index];

    printCheckHeader(index + 1, checks.length, check);

    const result = runCommand(check.command);

    results.push({
      name: check.name,
      success: result.success,
      duration: result.duration,
    });

    if (result.success) {
      printSuccess(check, result.duration);

      continue;
    }

    printFailure(check, result.duration, result.exitCode);

    /*
     * Remaining checks are intentionally not executed.
     * This makes the failure fast and easier to diagnose.
     */
    for (let skippedIndex = index + 1; skippedIndex < checks.length; skippedIndex += 1) {
      const skippedCheck = checks[skippedIndex];

      printSkipped(skippedCheck);

      results.push({
        name: skippedCheck.name,
        success: false,
        skipped: true,
        duration: '0.0',
      });
    }

    const totalDuration = ((Date.now() - startedAt) / 1000).toFixed(1);

    printSummary(results, totalDuration);

    /*
     * Preserve the original command exit code
     * whenever possible.
     */
    process.exit(
      typeof result.exitCode === 'number' && result.exitCode !== 0 ? result.exitCode : 1,
    );
  }

  const totalDuration = ((Date.now() - startedAt) / 1000).toFixed(1);

  printSummary(results, totalDuration);

  process.exit(0);
}

main();
