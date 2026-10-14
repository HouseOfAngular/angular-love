import { and, desc, eq, sql } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

import { aiNewsItems } from '@angular-love/blog-bff/shared/schema';
import {
  AiNewsCategory,
  AiNewsFeedResponse,
  resolveThumbnail,
} from '@angular-love/blog/contracts/ai-news';

import { AiNewsCursor, encodeCursor } from './cursor';

export interface AiNewsFeedPage {
  limit: number;
  category?: AiNewsCategory;
  cursor?: AiNewsCursor | null;
}

/**
 * One page of published items, newest first, with keyset pagination on
 * `(published_at, id)` so deep pages cost the same as the first one and
 * items sharing a publish date are neither skipped nor repeated.
 */
export async function getAiNewsFeed(
  db: LibSQLDatabase,
  { limit, category, cursor }: AiNewsFeedPage,
): Promise<AiNewsFeedResponse> {
  const rows = await db
    .select({
      id: aiNewsItems.id,
      url: aiNewsItems.url,
      title: aiNewsItems.title,
      summary: aiNewsItems.summary,
      imageUrl: aiNewsItems.imageUrl,
      sourceName: aiNewsItems.sourceName,
      sourceType: aiNewsItems.sourceType,
      author: aiNewsItems.author,
      category: aiNewsItems.category,
      publishedAt: aiNewsItems.publishedAt,
    })
    .from(aiNewsItems)
    .where(
      and(
        eq(aiNewsItems.status, 'published'),
        category ? eq(aiNewsItems.category, category) : undefined,
        cursor
          ? sql`(${aiNewsItems.publishedAt}, ${aiNewsItems.id}) < (${Math.floor(
              cursor.publishedAt.getTime() / 1000,
            )}, ${cursor.id})`
          : undefined,
      ),
    )
    .orderBy(desc(aiNewsItems.publishedAt), desc(aiNewsItems.id))
    // One extra row tells whether there is a next page.
    .limit(limit + 1);

  const page = rows.slice(0, limit);
  const last = page.at(-1);

  return {
    items: page.map(({ imageUrl, publishedAt, ...item }) => ({
      ...item,
      thumbnailUrl: resolveThumbnail({ url: item.url, imageUrl }),
      publishedAt: publishedAt.toISOString(),
    })),
    nextCursor:
      rows.length > limit && last
        ? encodeCursor({ publishedAt: last.publishedAt, id: last.id })
        : null,
  };
}
