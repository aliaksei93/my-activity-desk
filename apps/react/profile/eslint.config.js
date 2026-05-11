import { fileURLToPath } from 'node:url';
import nx from '@nx/eslint-plugin';
import tseslint from 'typescript-eslint';
import baseConfig from '../../../eslint.config.js';

const eslintTsconfig = fileURLToPath(new URL('./tsconfig.eslint.json', import.meta.url));

export default [
  ...nx.configs['flat/react'],
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parserOptions: {
        project: [eslintTsconfig],
      },
    },
    rules: {
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
          classes: false,
          variables: true,
          typedefs: true,
          enums: true,
          ignoreTypeReferences: true,
        },
      ],
      '@typescript-eslint/no-useless-constructor': 'error',
      'no-console': [
        'error',
        {
          allow: ['info', 'warn', 'error'],
        },
      ],
    },
  },
];
