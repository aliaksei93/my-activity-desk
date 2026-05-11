import nx from '@nx/eslint-plugin';

export const baseRestrictedSyntaxRules = [
  {
    selector: 'ForInStatement',
    message: 'Use Object.keys/Object.values/Object.entries instead of for..in over the prototype chain.',
  },
  {
    selector: 'LabeledStatement',
    message: 'Labels make control flow harder to reason about.',
  },
  {
    selector: 'WithStatement',
    message: '`with` is disallowed because it makes code unpredictable and hard to optimize.',
  },
  {
    selector: "CallExpression[callee.object.name='console'][callee.property.name='log']",
    message: 'Avoid console.log in application code. Use structured logging or console.info/warn/error when justified.',
  },
];

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/node_modules/**', '**/.nx/**', '**/coverage/**', '**/dist', '**/out-tsc', '**/vite.config.*.timestamp*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$', '^../../../tools/version-metadata\\.js$'],
          depConstraints: [
            {
              sourceTag: 'type:platform',
              onlyDependOnLibsWithTags: ['type:contracts', 'type:sdk', 'type:tokens', 'framework:agnostic'],
            },
            {
              sourceTag: 'type:sdk',
              onlyDependOnLibsWithTags: ['type:contracts', 'type:sdk', 'type:tokens', 'framework:agnostic'],
            },
            {
              sourceTag: 'type:contracts',
              onlyDependOnLibsWithTags: ['type:contracts', 'framework:agnostic'],
            },
            {
              sourceTag: 'framework:react',
              onlyDependOnLibsWithTags: [
                'framework:react',
                'type:contracts',
                'type:sdk',
                'type:tokens',
                'framework:agnostic',
              ],
            },
            {
              sourceTag: 'framework:vue',
              onlyDependOnLibsWithTags: [
                'framework:vue',
                'type:contracts',
                'type:sdk',
                'type:tokens',
                'framework:agnostic',
              ],
            },
            {
              sourceTag: 'framework:angular',
              onlyDependOnLibsWithTags: [
                'framework:angular',
                'type:contracts',
                'type:sdk',
                'type:tokens',
                'framework:agnostic',
                'type:mf',
              ],
            },
            {
              sourceTag: 'type:lab',
              onlyDependOnLibsWithTags: ['*'],
            },
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      'apps/**/*.{ts,tsx,js,jsx,cts,mts,cjs,mjs}',
      'libs/**/*.{ts,tsx,js,jsx,cts,mts,cjs,mjs}',
    ],
    rules: {
      'array-callback-return': 'error',
      'consistent-return': 'error',
      'default-case-last': 'error',
      'no-plusplus': [
        'error',
        {
          allowForLoopAfterthoughts: true,
        },
      ],
      'no-restricted-syntax': ['error', ...baseRestrictedSyntaxRules],
      'no-return-assign': ['error', 'always'],
    },
  },
  {
    files: [
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.spec.js',
      '**/*.spec.jsx',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.test.js',
      '**/*.test.jsx',
    ],
    languageOptions: {
      globals: {
        afterAll: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        it: 'readonly',
        test: 'readonly',
        vi: 'readonly',
      },
    },
  },
];
