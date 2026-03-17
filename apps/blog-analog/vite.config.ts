/// <reference types="vitest" />

import { resolve } from 'path';
import analog from '@analogjs/platform';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import tailwindcss from '@tailwindcss/vite';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { defineConfig } from 'vite';

import { nitroRouteRules } from './route-rules';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    cacheDir: `../../node_modules/.vite`,
    build: {
      outDir: '../../dist/apps/blog-analog/client',
      reportCompressedSize: true,
      target: ['es2020'],
    },
    server: {
      fs: {
        allow: ['.'],
      },
    },
    resolve: {
      alias: {
        '@shared-styles': resolve(
          __dirname,
          '../../libs/shared/assets/src/lib/styles',
        ),
      },
    },
    plugins: [
      analog({
        prerender: {
          routes: [],
        },
        nitro: {
          preset: 'cloudflare_module',
          compatibilityDate: '2025-09-27',
          cloudflare: {
            dev: {
              environment: mode === 'development' ? 'dev' : 'prod',
            },
          },
          rollupConfig: {
            plugins: [
              // this solves the "Cannot find package" issue while importing
              // workspace libraries
              // ref: https://github.com/analogjs/analog/pull/792
              typescriptPaths({
                tsConfigPath: 'tsconfig.base.json',
                preserveExtensions: true,
              }),
            ],
          },
          routeRules: nitroRouteRules,
        },
      }),
      nxViteTsPaths(),
      tailwindcss(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
    },
  };
});
