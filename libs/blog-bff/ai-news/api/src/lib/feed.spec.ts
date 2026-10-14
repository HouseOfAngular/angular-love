import { resolve } from 'node:path';
import { createClient } from '@libsql/client';
import { sql } from 'drizzle-orm';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

import { aiNewsItems } from '@angular-love/blog-bff/shared/schema';

import { decodeCursor, encodeCursor } from './cursor';
import { getAiNewsFeed } from './feed';
import { insertAiNewsItems } from './insert';
import { excerptFromSummary, getAiNewsItem } from './item';
import {
  AI_NEWS_MAX_INSERT,
  aiNewsCreateRequestSchema,
  AiNewsItemInput,
} from './schemas';
import { slugify } from './slug';

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
        slug: 'item-1',
        title: 'Item 1',
        excerpt: 'Summary 1',
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
        slug: 'item-1',
        status: 'created',
      },
      {
        id: expect.any(Number),
        url: 'https://example.com/b',
        slug: 'item-2',
        status: 'created',
      },
    ]);
    expect(await insertAiNewsItems(db, items)).toEqual(
      first.map(({ url, slug }) => ({ status: 'duplicate', url, slug })),
    );
    expect(
      await insertAiNewsItems(db, [
        item(3, at('2026-10-01T00:00:00Z'), { url: 'https://example.com/a#x' }),
      ]),
    ).toEqual([{ status: 'duplicate', url: first[0].url, slug: 'item-3' }]);

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
            (url, slug, title, summary, source_name, category, published_at, source_type, status)
            values ('https://example.com/raw', 'raw', 't', 's', 'n', ${category}, ${publishedAt}, ${sourceType}, ${status})`),
        ),
      ).rejects.toThrow(/CHECK constraint failed/);
    },
  );

  it('rejects a summary over 4000 or an excerpt over 280 characters', async () => {
    await expect(
      insertAiNewsItems(db, [
        item(1, at('2026-10-01T00:00:00Z'), { summary: 'x'.repeat(4001) }),
      ]),
    ).rejects.toThrow();
    await expect(
      insertAiNewsItems(db, [
        item(1, at('2026-10-01T00:00:00Z'), { excerpt: 'x'.repeat(281) }),
      ]),
    ).rejects.toThrow();
  });

  it('returns the stored excerpt in the feed, never the summary', async () => {
    await insertAiNewsItems(db, [
      item(1, at('2026-10-01T00:00:00Z'), {
        summary: 'A long summary.\n\n- One\n- Two',
        excerpt: 'Short card text.',
      }),
    ]);

    const [feedItem] = (await getAiNewsFeed(db, { limit: 1 })).items;
    expect(feedItem.excerpt).toBe('Short card text.');
    expect(feedItem).not.toHaveProperty('summary');
  });
});

describe('getAiNewsItem', () => {
  let db: LibSQLDatabase;

  beforeEach(async () => {
    db = drizzle({ client: createClient({ url: ':memory:' }) });
    await migrate(db, { migrationsFolder: MIGRATIONS });
    await insertAiNewsItems(db, [
      item(1, at('2026-10-01T08:00:00Z'), {
        summary: 'Para one.\n\n- Point',
        excerpt: 'Card text.',
      }),
      item(2, at('2026-10-02T08:00:00Z'), { status: 'draft' }),
    ]);
  });

  it('returns a published item with its summary', async () => {
    expect(await getAiNewsItem(db, 'item-1')).toMatchObject({
      id: 1,
      slug: 'item-1',
      excerpt: 'Card text.',
      summary: 'Para one.\n\n- Point',
      publishedAt: '2026-10-01T08:00:00.000Z',
    });
  });

  it('returns null for drafts and unknown slugs', async () => {
    expect(await getAiNewsItem(db, 'item-2')).toBeNull();
    expect(await getAiNewsItem(db, 'item-99')).toBeNull();
  });
});

describe('slugs', () => {
  let db: LibSQLDatabase;

  beforeEach(async () => {
    db = drizzle({ client: createClient({ url: ':memory:' }) });
    await migrate(db, { migrationsFolder: MIGRATIONS });
  });

  it('slugifies titles, dropping diacritics and symbols', () => {
    expect(slugify('Angular 21: Signal Forms & more!')).toBe(
      'angular-21-signal-forms-more',
    );
    expect(slugify('Żółta łódź')).toBe('zolta-lodz');
    expect(slugify('🤖 !!')).toBe('news');
    expect(slugify(`${'a'.repeat(99)} bcd`)).toBe('a'.repeat(99));
  });

  it('skips an item whose slug is taken, in the batch or already stored', async () => {
    const same = (n: number) =>
      item(n, at('2026-10-01T00:00:00Z'), { title: 'Same title' });
    await insertAiNewsItems(db, [same(1)]);
    const results = await insertAiNewsItems(db, [
      same(2),
      item(3, at('2026-10-01T00:00:00Z'), { slug: 'fresh' }),
      item(4, at('2026-10-01T00:00:00Z'), { slug: 'fresh' }),
    ]);

    expect(results).toEqual([
      {
        status: 'duplicate',
        url: 'https://example.com/post-2',
        slug: 'same-title',
      },
      {
        status: 'created',
        id: expect.any(Number),
        url: 'https://example.com/post-3',
        slug: 'fresh',
      },
      { status: 'duplicate', url: 'https://example.com/post-4', slug: 'fresh' },
    ]);
  });

  it('rejects a slug that is not lowercase words and dashes', async () => {
    await expect(
      insertAiNewsItems(db, [
        item(1, at('2026-10-01T00:00:00Z'), { slug: 'Not a slug' }),
      ]),
    ).rejects.toThrow();
  });
});

describe('excerptFromSummary', () => {
  it('keeps a short summary whole, as one line', () => {
    expect(excerptFromSummary('First.\n\n- One\n- Two')).toBe('First. One Two');
  });

  it('cuts a long summary at a word and adds an ellipsis', () => {
    const excerpt = excerptFromSummary(`${'word '.repeat(100)}end`);
    expect(excerpt.length).toBeLessThanOrEqual(281);
    expect(excerpt).toMatch(/word…$/);
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
