import { and, eq } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

import { aiNewsItems } from '@angular-love/blog-bff/shared/schema';
import {
  AI_NEWS_EXCERPT_MAX_LENGTH,
  AiNewsItem,
  AiNewsItemDetail,
  parseAiNewsSummary,
  resolveThumbnail,
} from '@angular-love/blog/contracts/ai-news';

/** The columns both the feed and the item endpoint read. */
export const aiNewsItemColumns = {
  id: aiNewsItems.id,
  url: aiNewsItems.url,
  slug: aiNewsItems.slug,
  title: aiNewsItems.title,
  summary: aiNewsItems.summary,
  excerpt: aiNewsItems.excerpt,
  imageUrl: aiNewsItems.imageUrl,
  sourceName: aiNewsItems.sourceName,
  sourceType: aiNewsItems.sourceType,
  author: aiNewsItems.author,
  category: aiNewsItems.category,
  publishedAt: aiNewsItems.publishedAt,
};

type AiNewsItemRow = Pick<
  typeof aiNewsItems.$inferSelect,
  keyof typeof aiNewsItemColumns
>;

export function toAiNewsItem({
  imageUrl,
  publishedAt,
  excerpt,
  summary,
  ...item
}: AiNewsItemRow): AiNewsItem {
  return {
    ...item,
    excerpt: excerpt ?? excerptFromSummary(summary),
    thumbnailUrl: resolveThumbnail({ url: item.url, imageUrl }),
    publishedAt: publishedAt.toISOString(),
  };
}

export function toAiNewsItemDetail(row: AiNewsItemRow): AiNewsItemDetail {
  return { ...toAiNewsItem(row), summary: row.summary };
}

/**
 * The summary as one line of text, cut at a word to fit the card. Items
 * written before excerpts existed have a summary short enough to fit whole.
 */
export function excerptFromSummary(summary: string): string {
  const text = parseAiNewsSummary(summary)
    .flatMap((block) => (block.kind === 'list' ? block.items : [block.text]))
    .join(' ');
  if (text.length <= AI_NEWS_EXCERPT_MAX_LENGTH) {
    return text;
  }
  const cut = text.slice(0, AI_NEWS_EXCERPT_MAX_LENGTH);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–—-]+$/, '')}…`;
}

/** A published item, or `null` if there is none with that slug. */
export async function getAiNewsItem(
  db: LibSQLDatabase,
  slug: string,
): Promise<AiNewsItemDetail | null> {
  const [row] = await db
    .select(aiNewsItemColumns)
    .from(aiNewsItems)
    .where(and(eq(aiNewsItems.slug, slug), eq(aiNewsItems.status, 'published')))
    .limit(1);
  return row ? toAiNewsItemDetail(row) : null;
}
