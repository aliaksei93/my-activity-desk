import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/vite.config.*.timestamp*'],
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
    files: ['**/*.ts', '**/*.tsx', '**/*.vue', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    // Override or add rules here
    rules: {},
  },
];
