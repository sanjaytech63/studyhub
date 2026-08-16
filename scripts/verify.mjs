import { spawnSync } from 'node:child_process';

const isWindows = process.platform === 'win32';

const npmCommand = isWindows ? 'npm.cmd' : 'npm';

const checks = [
  {
    name: 'TypeScript',
    command: 'npm run typecheck',
  },
  {
    name: 'ESLint',
    command: 'npm run lint',
  },
  {
    name: 'Prettier',
    command: 'npm run format:check',
  },
  {
    name: 'Tests',
    command: 'npm test',
  },
  {
    name: 'Production Build',
    command: 'npm run build',
  },
];

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m',
};

function printHeader() {
  console.log('');
  console.log(
    `${colors.cyan}${colors.bold}╔══════════════════════════════════════════════════════════════╗${colors.reset}`,
  );
  console.log(
    `${colors.cyan}${colors.bold}║                 STUDYHUB QUALITY CHECK                       ║${colors.reset}`,
  );
  console.log(
    `${colors.cyan}${colors.bold}╚══════════════════════════════════════════════════════════════╝${colors.reset}`,
  );
  console.log('');
}

function printStep(index, total, name) {
  console.log(
    `${colors.cyan}${colors.bold}[${index}/${total}]${colors.reset} ${colors.bold}${name}${colors.reset}`,
  );
}

function printSuccess(name, duration) {
  console.log(
    `  ${colors.green}✔${colors.reset} ${name} ${colors.gray}(${duration}s)${colors.reset}`,
  );
  console.log('');
}

function printFailure(name, duration) {
  console.log(
    `  ${colors.red}✖${colors.reset} ${name} ${colors.gray}(${duration}s)${colors.reset}`,
  );
  console.log('');
}

function runCommand(command) {
  const startedAt = Date.now();

  const result = spawnSync(npmCommand, command.replace('npm ', '').split(' '), {
    stdio: 'inherit',
    shell: false,
  });

  const duration = ((Date.now() - startedAt) / 1000).toFixed(1);

  return {
    success: result.status === 0,
    duration,
  };
}

printHeader();

const startedAt = Date.now();

for (let index = 0; index < checks.length; index += 1) {
  const check = checks[index];

  printStep(index + 1, checks.length, check.name);

  const result = runCommand(check.command);

  if (!result.success) {
    printFailure(check.name, result.duration);

    console.log(`${colors.red}${colors.bold}✖ Quality check failed.${colors.reset}`);

    console.log(
      `${colors.yellow}Fix the issue above and run "npm run verify" again.${colors.reset}`,
    );

    process.exit(1);
  }

  printSuccess(check.name, result.duration);
}

const totalDuration = ((Date.now() - startedAt) / 1000).toFixed(1);

console.log(
  `${colors.green}${colors.bold}╔══════════════════════════════════════════════════════════════╗${colors.reset}`,
);
console.log(
  `${colors.green}${colors.bold}║                    ALL CHECKS PASSED                         ║${colors.reset}`,
);
console.log(
  `${colors.green}${colors.bold}╚══════════════════════════════════════════════════════════════╝${colors.reset}`,
);

console.log('');
console.log(`${colors.green}✔${colors.reset} TypeScript`);
console.log(`${colors.green}✔${colors.reset} ESLint`);
console.log(`${colors.green}✔${colors.reset} Prettier`);
console.log(`${colors.green}✔${colors.reset} Tests`);
console.log(`${colors.green}✔${colors.reset} Production build`);

console.log('');
console.log(`${colors.gray}Completed in ${totalDuration}s${colors.reset}`);
console.log('');
