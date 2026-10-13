/*
  Builds a local blog database from bundled fixtures. Needs no WordPress access
  and no environment variables, and never touches Turso.

  Usage: nx run api-jobs:seed [--out=<path>]
*/
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';

import { buildLocalDatabase } from '../lib/rebuild';
import { seedWp } from '../lib/seed-data';

import { run } from './cli';

run(async () => {
  const { values } = parseArgs({
    options: { out: { type: 'string', default: 'tmp/blog-jobs/local.db' } },
    strict: true,
  });
  const path = resolve(values.out);

  const { skipped } = await buildLocalDatabase({
    path,
    wp: seedWp,
    // Nx runs targets from the workspace root.
    migrationsFolder: resolve('libs/blog-bff/shared/schema/drizzle'),
  });
  if (skipped.length > 0) {
    throw new Error(`Fixtures failed to map:\n${skipped.join('\n')}`);
  }
  console.log(`Local database ready: ${path}`);
});
