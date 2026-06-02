import { mkdir, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { count } from 'drizzle-orm';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

import {
  initHighlighter,
  insertArticle,
  insertAuthor,
  prepareLocalDb,
  replaceDatabase,
  toArticle,
  toAuthor,
  TursoApi,
  WpResource,
} from '@angular-love/blog-bff/shared/api-turso';
import { articles, authors } from '@angular-love/blog-bff/shared/schema';

import { forEachConcurrent, retry } from './pool';

/**
 * Builds a fresh SQLite file from WordPress: applies the migrations, then
 * fetches, maps and inserts every author and post. Returns the entities that
 * were skipped because they could not be mapped.
 *
 * Mapping errors (e.g. a post without a locale) skip the entity, like the old
 * scripts did. Fetch errors fail the build: a network blip must not silently
 * drop content from production.
 */
export async function buildLocalDatabase({
  path,
  wp,
  migrationsFolder,
  concurrency = 6,
}: {
  path: string;
  wp: WpResource;
  migrationsFolder: string;
  concurrency?: number;
}): Promise<{ skipped: string[] }> {
  await mkdir(dirname(path), { recursive: true });
  for (const suffix of ['', '-wal', '-shm', '-journal']) {
    await rm(path + suffix, { force: true });
  }

  const db = drizzle({ connection: { url: `file:${path}` } });
  await migrate(db, { migrationsFolder });
  await initHighlighter();
  const skipped: string[] = [];

  const authorIds = await wp.authorIds();
  console.log(`Authors: ${authorIds.length}`);
  await forEachConcurrent(authorIds, concurrency, async (id) => {
    const { data } = await retry(() => wp.author(id));
    let author;
    try {
      author = toAuthor(data);
    } catch (error) {
      skipped.push(`author ${id}: ${error}`);
      return;
    }
    await insertAuthor(db, author);
  });

  const postIds = await wp.postIds();
  console.log(`Posts: ${postIds.length}`);
  let done = 0;
  await forEachConcurrent(postIds, concurrency, async (id) => {
    const { data } = await retry(() => wp.post(id));
    let article;
    try {
      article = toArticle(data);
    } catch (error) {
      skipped.push(`post ${id}: ${error}`);
      return;
    }
    await insertArticle(db, article);
    if (++done % 100 === 0) console.log(`  ${done}/${postIds.length}`);
  });

  db.$client.close();
  await prepareLocalDb(path);
  return { skipped };
}

/**
 * Replaces a Turso database with a local SQLite file built by
 * `buildLocalDatabase`. Refuses an empty file, and only swaps the database
 * once the uploaded copy has the same row counts as the local file.
 */
export async function publishDatabase({
  turso,
  dbName,
  path,
}: {
  turso: TursoApi;
  dbName: string;
  path: string;
}): Promise<void> {
  const local = drizzle({ connection: { url: `file:${path}` } });
  const expected = await countRows(local);
  local.$client.close();
  if (expected.authors === 0 || expected.articles === 0) {
    throw new Error(
      `Refusing to publish ${path}: ${expected.authors} authors, ${expected.articles} articles`,
    );
  }

  await replaceDatabase(turso, dbName, path, async (uploaded) => {
    const actual = await countRows(uploaded);
    if (
      actual.authors !== expected.authors ||
      actual.articles !== expected.articles
    ) {
      throw new Error(
        `Uploaded database does not match ${path}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
      );
    }
  });
}

async function countRows(db: LibSQLDatabase) {
  const [[authorsCount], [articlesCount]] = await Promise.all([
    db.select({ n: count() }).from(authors),
    db.select({ n: count() }).from(articles),
  ]);
  return { authors: authorsCount.n, articles: articlesCount.n };
}
