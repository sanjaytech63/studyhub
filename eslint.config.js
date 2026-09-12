import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/packages/database/src/generated/**',
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    plugins: {
      '@next/next': nextPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },

    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
);
