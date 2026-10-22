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
    },
  },
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.html'],
    rules: {
      // Enabled by the angular-eslint v22 template accessibility preset;
      // not enforced before the upgrade.
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
    },
  },
];
