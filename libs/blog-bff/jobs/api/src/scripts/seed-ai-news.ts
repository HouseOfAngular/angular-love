/*
  Adds fictional AI news items to a local blog database. Dev only: it takes a
  file path, never a URL, so it can't reach Turso. Safe to run again; items
  whose canonical URL already exists are skipped. Run the migrations first.

  Usage: nx run api-jobs:seed-ai-news [--db=<path>]
*/
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { drizzle } from 'drizzle-orm/libsql';

import { insertAiNewsItems } from '@angular-love/blog-bff/ai-news/api';

import { aiNewsSeedItems } from '../lib/ai-news-seed-data';

import { run } from './cli';

run(async () => {
  const { values } = parseArgs({
    options: { db: { type: 'string', default: 'tmp/blog-jobs/local.db' } },
    strict: true,
  });
  const path = resolve(values.db);
  if (!existsSync(path)) {
    throw new Error(
      `${path} does not exist. Create it with \`nx run api-jobs:seed\` first.`,
    );
  }

  const db = drizzle({ connection: { url: `file:${path}` } });
  const items = aiNewsSeedItems();
  const results = await insertAiNewsItems(db, items);
  const inserted = results.filter((r) => r.status === 'created').length;

  console.log(
    `AI news: inserted ${inserted}, skipped ${items.length - inserted} already present (${path})`,
  );
});
