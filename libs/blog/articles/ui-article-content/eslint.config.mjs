import { dirname } from 'path';
import { fileURLToPath } from 'url';
import nx from '@nx/eslint-plugin';

import baseConfig from '../../../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'al',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'al',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-standalone': 'off',
    },
  },
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      // Enabled by the angular-eslint v22 recommended preset. The Angular 22
      // `change-detection-eager` migration pinned this project's non-OnPush
      // components to `ChangeDetectionStrategy.Eager` to keep their behavior.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
];
