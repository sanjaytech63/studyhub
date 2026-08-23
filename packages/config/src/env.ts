import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

const findWorkspaceRoot = (startDirectory: string): string | undefined => {
  let currentDirectory = path.resolve(startDirectory);

  while (true) {
    const packageJsonPath = path.join(currentDirectory, 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as {
          workspaces?: unknown;
        };

        if (Array.isArray(packageJson.workspaces)) {
          return currentDirectory;
        }
      } catch {
        // Continue searching parent directories.
      }
    }

    const parentDirectory = path.dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      return undefined;
    }

    currentDirectory = parentDirectory;
  }
};

const workspaceRoot = findWorkspaceRoot(process.cwd());

if (workspaceRoot) {
  dotenv.config({
    path: path.join(workspaceRoot, '.env'),
  });
}
