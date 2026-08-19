import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const isDisabled = process.env.HUSKY === '0' || process.env.CI === 'true';
const hasGitDirectory = existsSync('.git');
const huskyEntryPoint = 'node_modules/husky/bin.js';

if (!isDisabled && hasGitDirectory && existsSync(huskyEntryPoint)) {
  const result = spawnSync(process.execPath, [huskyEntryPoint], { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}
