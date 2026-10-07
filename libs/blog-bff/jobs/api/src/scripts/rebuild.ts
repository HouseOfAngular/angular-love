/*
  Rebuilds the blog database from WordPress and replaces TURSO_DB_NAME with it.

  Usage: nx run api-jobs:rebuild [--local-only] [--out=<path>] [--concurrency=<n>]
  Env: WP_REST_API_BASE_URL, WP_REST_API_TOKEN, and unless --local-only: TURSO_ORG, TURSO_API_TOKEN, TURSO_DB_NAME
*/
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';

import {
  createTursoApi,
  getWpResource,
} from '@angular-love/blog-bff/shared/api-turso';

import { buildLocalDatabase, publishDatabase } from '../lib/rebuild';

import { requireEnv, run } from './cli';

run(async () => {
  const { values } = parseArgs({
    options: {
      out: { type: 'string', default: 'tmp/blog-jobs/local.db' },
      'local-only': { type: 'boolean', default: false },
      concurrency: { type: 'string', default: '6' },
    },
    strict: true,
  });
  const path = resolve(values.out);
  const concurrency = Number(values.concurrency);
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error(`--concurrency must be a positive integer`);
  }

  const [wpBaseUrl, wpApiToken] = requireEnv(
    'WP_REST_API_BASE_URL',
    'WP_REST_API_TOKEN',
  );
  // Read the publish config up front, so a missing variable fails before the slow part.
  const publish = values['local-only']
    ? undefined
    : requireEnv('TURSO_ORG', 'TURSO_API_TOKEN', 'TURSO_DB_NAME');

  const { skipped } = await buildLocalDatabase({
    path,
    wp: getWpResource({ baseUrl: wpBaseUrl, apiToken: wpApiToken }),
    // Nx runs targets from the workspace root.
    migrationsFolder: resolve('libs/blog-bff/shared/schema/drizzle'),
    concurrency,
  });
  if (skipped.length > 0) {
    console.warn(`Skipped ${skipped.length} entities:\n${skipped.join('\n')}`);
  }
  console.log(`Local database ready: ${path}`);

  if (publish) {
    const [org, token, dbName] = publish;
    console.log(`Replacing ${dbName}...`);
    await publishDatabase({
      turso: createTursoApi({ org, token }),
      dbName,
      path,
    });
    console.log(`${dbName}: replaced`);
  }
});
