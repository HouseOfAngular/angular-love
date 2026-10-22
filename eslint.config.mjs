import { dirname } from 'path';
import { fileURLToPath } from 'url';
import nx from '@nx/eslint-plugin';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  ...nx.configs['flat/base'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'scope:client',
              onlyDependOnLibsWithTags: ['scope:client', 'scope:shared'],
            },
            {
              sourceTag: 'scope:bff',
              onlyDependOnLibsWithTags: ['scope:bff', 'scope:shared'],
            },
            {
              sourceTag: 'scope:client-analog',
              onlyDependOnLibsWithTags: [
                'scope:client',
                'scope:bff',
                'scope:shared',
              ],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['*'],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:data-access',
                'type:ui',
                'type:util',
                'type:types',
                'type:contract',
              ],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: [
                'type:data-access',
                'type:ui',
                'type:util',
                'type:types',
                'type:contract',
              ],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:util',
                'type:types',
                'type:contract',
              ],
            },
            {
              sourceTag: 'type:api',
              onlyDependOnLibsWithTags: [
                'type:api',
                'type:contract',
                'type:util',
                'type:schema',
              ],
            },
            {
              sourceTag: 'type:schema',
              onlyDependOnLibsWithTags: ['type:types', 'type:contract'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util', 'type:contract'],
            },
            {
              sourceTag: 'type:types',
              onlyDependOnLibsWithTags: ['type:types', 'type:contract'],
            },
            {
              sourceTag: 'type:contract',
              onlyDependOnLibsWithTags: ['type:contract'],
            },
          ],
        },
      ],
    },
  },
  ...nx.configs['flat/typescript'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-extra-semi': 'off',
    },
  },
  ...nx.configs['flat/javascript'],
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'no-extra-semi': 'off',
    },
  },
  ...compat
    .config({
      env: {
        jest: true,
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
      rules: {
        ...config.rules,
      },
    })),
];
