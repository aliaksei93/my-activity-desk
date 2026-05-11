import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import baseConfig from '../../../eslint.config.js';

const eslintTsconfig = fileURLToPath(new URL('./tsconfig.eslint.json', import.meta.url));

export default [
  ...baseConfig,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        project: [eslintTsconfig],
      },
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: [eslintTsconfig],
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.vue'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
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
      'vue/multi-word-component-names': 'off',
    },
  },
];
