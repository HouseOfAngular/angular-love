// The single list of values: the Drizzle columns, the table's CHECK constraints
// (so adding a value needs a migration), the Zod schemas in
// `@angular-love/blog-bff/ai-news/api` and the frontend all derive from these.
export const AI_NEWS_SOURCE_TYPES = [
  'blog',
  'social',
  'video',
  'repo',
  'paper',
  'podcast',
  'newsletter',
  'other',
] as const;
export const AI_NEWS_CATEGORIES = [
  'models',
  'tools',
  'research',
  'industry',
] as const;
export const AI_NEWS_STATUSES = ['draft', 'published'] as const;

export type AiNewsSourceType = (typeof AI_NEWS_SOURCE_TYPES)[number];
export type AiNewsCategory = (typeof AI_NEWS_CATEGORIES)[number];
export type AiNewsStatus = (typeof AI_NEWS_STATUSES)[number];

/** The card text. */
export const AI_NEWS_EXCERPT_MAX_LENGTH = 280;
/** The text in the item's panel: paragraphs and `- ` lists, see `parseAiNewsSummary`. */
export const AI_NEWS_SUMMARY_MAX_LENGTH = 4000;
export const AI_NEWS_DEFAULT_LIMIT = 20;
export const AI_NEWS_MAX_LIMIT = 50;

export function isAiNewsCategory(value: unknown): value is AiNewsCategory {
  return AI_NEWS_CATEGORIES.includes(value as AiNewsCategory);
}

/** An item as the feed API returns it. */
export interface AiNewsItem {
  id: number;
  url: string;
  /** The item's page is `/ai-news/<slug>`. */
  slug: string;
  title: string;
  /** The stored excerpt, or the start of the summary for items without one. */
  excerpt: string;
  thumbnailUrl: string | null;
  sourceName: string;
  sourceType: AiNewsSourceType;
  author: string | null;
  category: AiNewsCategory;
  /** ISO 8601, the source's publish date. */
  publishedAt: string;
}

/** An item as `GET /api/ai-news/:id` returns it. */
export interface AiNewsItemDetail extends AiNewsItem {
  summary: string;
}

export interface AiNewsFeedQuery {
  cursor?: string;
  limit?: number;
  category?: AiNewsCategory;
}

export interface AiNewsFeedResponse {
  items: AiNewsItem[];
  nextCursor: string | null;
}
