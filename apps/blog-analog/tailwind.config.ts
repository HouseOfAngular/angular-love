import { join } from 'node:path';
import { createGlobPatternsForDependencies } from '@nx/angular/tailwind';
import type { Config } from 'tailwindcss';

export default {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html,md,analog,ag}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
