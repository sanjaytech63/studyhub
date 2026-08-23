import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, env } from 'prisma/config';

const currentFile = fileURLToPath(import.meta.url);

const currentDirectory = path.dirname(currentFile);

const rootEnvPath = path.resolve(currentDirectory, '../../.env');

dotenv.config({
  path: rootEnvPath,
});

export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations',
  },

  datasource: {
    url: env('DATABASE_URL'),
  },
});
