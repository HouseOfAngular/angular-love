/*
  Builds a local blog database from bundled fixtures: authors and articles,
  plus fictional AI news items. Needs no WordPress access and no environment
  variables, and never touches Turso.

  Usage: nx run api-jobs:seed [--out=<path>]
*/
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { drizzle } from 'drizzle-orm/libsql';

import { insertAiNewsItems } from '@angular-love/blog-bff/ai-news/api';

import { aiNewsSeedItems } from '../lib/ai-news-seed-data';
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

  // Not WordPress content, so it goes in after the build has migrated the file.
  const db = drizzle({ connection: { url: `file:${path}` } });
  await insertAiNewsItems(db, aiNewsSeedItems());

  console.log(`Local database ready: ${path}`);
});
