import { fileURLToPath } from 'node:url';
import nx from '@nx/eslint-plugin';
import baseConfig, { baseRestrictedSyntaxRules } from '../../../eslint.config.js';

const eslintTsconfig = fileURLToPath(new URL('./tsconfig.eslint.json', import.meta.url));

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
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
      'array-callback-return': 'error',
      'consistent-return': 'error',
      'default-case-last': 'error',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-plusplus': [
        'error',
        {
          allowForLoopAfterthoughts: true,
        },
      ],
      'no-restricted-syntax': [
        'error',
        ...baseRestrictedSyntaxRules,
        {
          selector: 'ImportSpecifier[imported.name=/.*Module$/][imported.name!=/^(FormsModule|ReactiveFormsModule)$/]',
          message:
            'NgModule imports are restricted in board runtime code. Prefer standalone directives/components/pipes or provider APIs.',
        },
      ],
      'no-return-assign': ['error', 'always'],
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
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
