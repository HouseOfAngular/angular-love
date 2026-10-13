import { resolve } from 'node:path';
import { createClient } from '@libsql/client';
import { sql } from 'drizzle-orm';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

import { aiNewsItems } from '@angular-love/blog-bff/shared/schema';

import { decodeCursor, encodeCursor } from './cursor';
import { getAiNewsFeed } from './feed';
import { insertAiNewsItems } from './insert';
import {
  AI_NEWS_MAX_INSERT,
  aiNewsCreateRequestSchema,
  AiNewsItemInput,
} from './schemas';

const MIGRATIONS = resolve(__dirname, '../../../../shared/schema/drizzle');

const at = (iso: string) => new Date(iso);

function item(
  n: number,
  publishedAt: Date,
  overrides: Partial<AiNewsItemInput> = {},
): AiNewsItemInput {
  return {
    url: `https://example.com/post-${n}`,
    title: `Item ${n}`,
    summary: `Summary ${n}`,
    sourceName: 'Example',
    category: 'models',
    publishedAt,
    ...overrides,
  };
}

describe('cursor', () => {
  it('round-trips the publish date (whole seconds) and id', () => {
    const cursor = { publishedAt: at('2026-10-01T12:34:56.000Z'), id: 42 };
    const encoded = encodeCursor(cursor);

    expect(encoded).toMatch(/^[\w-]+$/);
    expect(decodeCursor(encoded)).toEqual(cursor);
  });

  it('drops sub-second precision, as the database stores seconds', () => {
    const encoded = encodeCursor({
      publishedAt: at('2026-10-01T12:34:56.789Z'),
      id: 1,
    });
    expect(decodeCursor(encoded)?.publishedAt).toEqual(
      at('2026-10-01T12:34:56.000Z'),
    );
  });

  it.each([['garbage!'], [btoa('1.2.3')], [btoa('abc.1')], [btoa('12')], ['']])(
    'rejects %p',
    (cursor) => {
      expect(decodeCursor(cursor)).toBeNull();
    },
  );
});

describe('getAiNewsFeed', () => {
  let db: LibSQLDatabase;

  beforeEach(async () => {
    db = drizzle({ client: createClient({ url: ':memory:' }) });
    await migrate(db, { migrationsFolder: MIGRATIONS });
  });

  async function readAll(
    pageSize: number,
    category?: 'models' | 'tools',
  ): Promise<number[][]> {
    const pages: number[][] = [];
    let cursor: string | null = null;
    do {
      const page = await getAiNewsFeed(db, {
        limit: pageSize,
        category,
        cursor: cursor ? decodeCursor(cursor) : null,
      });
      pages.push(page.items.map((i) => i.id));
      cursor = page.nextCursor;
    } while (cursor);
    return pages;
  }

  it('orders by publishedAt DESC, id DESC and pages without gaps or repeats across ties', async () => {
    const sameSecond = at('2026-10-10T10:00:00Z');
    await insertAiNewsItems(db, [
      item(1, at('2026-10-09T10:00:00Z')),
      item(2, sameSecond),
      item(3, sameSecond),
      item(4, sameSecond),
      item(5, at('2026-10-11T10:00:00Z')),
      item(6, sameSecond),
    ]);

    // Page boundaries fall inside the run of items sharing a timestamp.
    expect(await readAll(2)).toEqual([
      [5, 6],
      [4, 3],
      [2, 1],
    ]);
    expect((await readAll(4)).flat()).toEqual([5, 6, 4, 3, 2, 1]);
  });

  it('returns a null cursor on the last page, including an exactly full one', async () => {
    await insertAiNewsItems(db, [
      item(1, at('2026-10-01T00:00:00Z')),
      item(2, at('2026-10-02T00:00:00Z')),
    ]);

    const page = await getAiNewsFeed(db, { limit: 2 });
    expect(page.items).toHaveLength(2);
    expect(page.nextCursor).toBeNull();
  });

  it('skips drafts and filters by category', async () => {
    await insertAiNewsItems(db, [
      item(1, at('2026-10-01T00:00:00Z'), { category: 'tools' }),
      item(2, at('2026-10-02T00:00:00Z'), { status: 'draft' }),
      item(3, at('2026-10-03T00:00:00Z')),
      item(4, at('2026-10-04T00:00:00Z'), { category: 'tools' }),
    ]);

    expect((await readAll(10)).flat()).toEqual([4, 3, 1]);
    expect((await readAll(1, 'tools')).flat()).toEqual([4, 1]);
  });

  it('returns the API shape with a resolved thumbnail', async () => {
    await insertAiNewsItems(db, [
      item(1, at('2026-10-01T08:00:00Z'), {
        url: 'https://youtu.be/dQw4w9WgXcQ?utm_source=feed',
        sourceType: 'video',
      }),
    ]);

    const { items } = await getAiNewsFeed(db, { limit: 20 });
    expect(items).toEqual([
      {
        id: 1,
        url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Item 1',
        summary: 'Summary 1',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        sourceName: 'Example',
        sourceType: 'video',
        author: null,
        category: 'models',
        publishedAt: '2026-10-01T08:00:00.000Z',
      },
    ]);
  });

  it('uses the feed index for the keyset query', async () => {
    const plan = await db.all<{ detail: string }>(
      `EXPLAIN QUERY PLAN SELECT id FROM ai_news_items
       WHERE status = 'published' AND (published_at, id) < (1, 1)
       ORDER BY published_at DESC, id DESC LIMIT 21`,
    );
    const details = plan.map((row) => row.detail).join('\n');
    expect(details).toContain('ai_news_feed_idx');
    expect(details).not.toContain('TEMP B-TREE');
  });
});

describe('insertAiNewsItems', () => {
  let db: LibSQLDatabase;

  beforeEach(async () => {
    db = drizzle({ client: createClient({ url: ':memory:' }) });
    await migrate(db, { migrationsFolder: MIGRATIONS });
  });

  it('canonicalizes URLs and skips duplicates, so it is idempotent', async () => {
    const items = [
      item(1, at('2026-10-01T00:00:00Z'), {
        url: 'https://www.example.com/a/?utm_medium=x',
      }),
      item(2, at('2026-10-01T00:00:00Z'), { url: 'https://example.com/b' }),
    ];

    const first = await insertAiNewsItems(db, items);
    expect(first).toEqual([
      {
        id: expect.any(Number),
        url: 'https://example.com/a',
        status: 'created',
      },
      {
        id: expect.any(Number),
        url: 'https://example.com/b',
        status: 'created',
      },
    ]);
    expect(await insertAiNewsItems(db, items)).toEqual(
      first.map((r) => ({ ...r, status: 'duplicate' })),
    );
    expect(
      await insertAiNewsItems(db, [
        item(3, at('2026-10-01T00:00:00Z'), { url: 'https://example.com/a#x' }),
      ]),
    ).toEqual([{ ...first[0], status: 'duplicate' }]);

    const rows = await db.select({ url: aiNewsItems.url }).from(aiNewsItems);
    expect(rows.map((r) => r.url)).toEqual([
      'https://example.com/a',
      'https://example.com/b',
    ]);
  });

  it('reports a URL repeated within one batch as created once', async () => {
    const results = await insertAiNewsItems(db, [
      item(1, at('2026-10-01T00:00:00Z'), { url: 'https://example.com/a' }),
      item(2, at('2026-10-01T00:00:00Z'), { url: 'https://example.com/a/' }),
    ]);

    expect(results.map((r) => r.status)).toEqual(['created', 'duplicate']);
    expect(results[1].id).toBe(results[0].id);
  });

  it('stores publishedAt as unix seconds', async () => {
    await insertAiNewsItems(db, [item(1, at('2026-10-01T00:00:00Z'))]);

    const [row] = await db.all<{ published_at: number }>(
      sql`select published_at from ai_news_items`,
    );
    expect(row.published_at).toBe(Date.UTC(2026, 9, 1) / 1000);
  });

  it.each([
    ['an unknown category', "'model'", '1760000000', "'blog'", "'published'"],
    [
      'an unknown source type',
      "'models'",
      '1760000000',
      "'tweet'",
      "'published'",
    ],
    ['an unknown status', "'models'", '1760000000', "'blog'", "'live'"],
    [
      'a date in milliseconds',
      "'models'",
      '1760000000000',
      "'blog'",
      "'published'",
    ],
  ])(
    'the database itself rejects %s written with raw SQL',
    async (_, category, publishedAt, sourceType, status) => {
      await expect(
        db.run(
          sql.raw(`insert into ai_news_items
            (url, title, summary, source_name, category, published_at, source_type, status)
            values ('https://example.com/raw', 't', 's', 'n', ${category}, ${publishedAt}, ${sourceType}, ${status})`),
        ),
      ).rejects.toThrow(/CHECK constraint failed/);
    },
  );

  it('rejects a summary over 280 characters', async () => {
    await expect(
      insertAiNewsItems(db, [
        item(1, at('2026-10-01T00:00:00Z'), { summary: 'x'.repeat(281) }),
      ]),
    ).rejects.toThrow();
  });
});

describe('aiNewsCreateRequestSchema', () => {
  const body = (publishedAt?: unknown) => ({
    items: [
      {
        url: 'https://example.com/a',
        title: 'Title',
        summary: 'Summary',
        sourceName: 'Example',
        category: 'models',
        publishedAt,
      },
    ],
  });

  it('parses an ISO date with an offset', () => {
    const parsed = aiNewsCreateRequestSchema.parse(
      body('2026-10-01T12:00:00+02:00'),
    );
    expect(parsed.items[0].publishedAt).toEqual(at('2026-10-01T10:00:00Z'));
  });

  it('defaults publishedAt to now', () => {
    const before = Date.now();
    const parsed = aiNewsCreateRequestSchema.parse(body());
    expect(parsed.items[0].publishedAt.getTime()).toBeGreaterThanOrEqual(
      before,
    );
  });

  it.each([
    ['unix seconds', 1760000000],
    ['unix milliseconds', 1760000000000],
    ['a date without a time zone', '2026-10-01T12:00:00'],
    ['a date far in the future', '2099-01-01T00:00:00Z'],
  ])('rejects %s', (_, publishedAt) => {
    expect(aiNewsCreateRequestSchema.safeParse(body(publishedAt)).success).toBe(
      false,
    );
  });

  it('rejects an unknown category and an empty or oversized batch', () => {
    const invalidCategory = body();
    invalidCategory.items[0].category = 'model';
    expect(aiNewsCreateRequestSchema.safeParse(invalidCategory).success).toBe(
      false,
    );
    expect(aiNewsCreateRequestSchema.safeParse({ items: [] }).success).toBe(
      false,
    );
    const tooMany = {
      items: Array(AI_NEWS_MAX_INSERT + 1).fill(body().items[0]),
    };
    expect(aiNewsCreateRequestSchema.safeParse(tooMany).success).toBe(false);
  });
});
