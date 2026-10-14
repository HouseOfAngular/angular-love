import * as z from 'zod';

import {
  AI_NEWS_CATEGORIES,
  AI_NEWS_DEFAULT_LIMIT,
  AI_NEWS_EXCERPT_MAX_LENGTH,
  AI_NEWS_MAX_LIMIT,
  AI_NEWS_SOURCE_TYPES,
  AI_NEWS_STATUSES,
  AI_NEWS_SUMMARY_MAX_LENGTH,
  AiNewsFeedResponse,
  AiNewsItemDetail,
} from '@angular-love/blog/contracts/ai-news';

import { AI_NEWS_SLUG_MAX_LENGTH, AI_NEWS_SLUG_PATTERN } from './slug';

export const aiNewsSourceTypeSchema = z.enum(AI_NEWS_SOURCE_TYPES);
export const aiNewsCategorySchema = z.enum(AI_NEWS_CATEGORIES);
export const aiNewsStatusSchema = z.enum(AI_NEWS_STATUSES);

function aiNewsSlugSchema() {
  return z
    .string()
    .max(AI_NEWS_SLUG_MAX_LENGTH)
    .regex(AI_NEWS_SLUG_PATTERN, 'lowercase words joined by dashes');
}

/** The `:slug` of `GET /api/ai-news/:slug`. */
export const aiNewsSlugParamSchema = aiNewsSlugSchema();

/** An item as it is written to the database (seed, future ingestion). */
export const aiNewsItemInputSchema = z.object({
  url: z.url({ protocol: /^https?$/ }).max(2048),
  title: z.string().trim().min(1).max(300),
  /** `/ai-news/<slug>`. Made from the title when missing. */
  slug: aiNewsSlugSchema().optional(),
  // Lengths are enforced here only, never in the database.
  summary: z.string().trim().min(1).max(AI_NEWS_SUMMARY_MAX_LENGTH),
  /** The card text. Without it the card shows the start of the summary. */
  excerpt: z.string().trim().min(1).max(AI_NEWS_EXCERPT_MAX_LENGTH).nullish(),
  imageUrl: z
    .url({ protocol: /^https?$/ })
    .max(2048)
    .nullish(),
  sourceName: z.string().trim().min(1).max(100),
  sourceType: aiNewsSourceTypeSchema.default('other'),
  author: z.string().trim().min(1).max(100).nullish(),
  category: aiNewsCategorySchema,
  status: aiNewsStatusSchema.default('published'),
  publishedAt: z.date(),
});

export type AiNewsItemInput = z.input<typeof aiNewsItemInputSchema>;

export const aiNewsFeedQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(AI_NEWS_MAX_LIMIT)
    .default(AI_NEWS_DEFAULT_LIMIT),
  category: aiNewsCategorySchema.optional(),
});

export type ParsedAiNewsFeedQuery = z.output<typeof aiNewsFeedQuerySchema>;

export const aiNewsItemSchema = z.object({
  id: z.number().int(),
  url: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  thumbnailUrl: z.string().nullable(),
  sourceName: z.string(),
  sourceType: aiNewsSourceTypeSchema,
  author: z.string().nullable(),
  category: aiNewsCategorySchema,
  publishedAt: z.iso.datetime(),
});

export const aiNewsFeedResponseSchema = z.object({
  items: z.array(aiNewsItemSchema),
  nextCursor: z.string().nullable(),
}) satisfies z.ZodType<AiNewsFeedResponse>;

export const aiNewsItemDetailSchema = aiNewsItemSchema.extend({
  summary: z.string(),
}) satisfies z.ZodType<AiNewsItemDetail>;

export const AI_NEWS_MAX_INSERT = 50;
/** Allowed clock drift for `publishedAt`; anything later would stay pinned on top. */
const MAX_FUTURE_MS = 60 * 60 * 1000;

/**
 * `POST /api/ai-news`. `publishedAt` is an ISO 8601 string with a time zone
 * (numbers are rejected, so seconds and milliseconds can't be mixed up) and
 * defaults to now.
 */
export const aiNewsCreateRequestSchema = z.object({
  items: z
    .array(
      aiNewsItemInputSchema.extend({
        publishedAt: z.iso
          .datetime({ offset: true })
          .optional()
          .transform((iso) => (iso ? new Date(iso) : new Date()))
          .refine(
            (date) => date.getTime() <= Date.now() + MAX_FUTURE_MS,
            'publishedAt is in the future',
          ),
      }),
    )
    .min(1)
    .max(AI_NEWS_MAX_INSERT),
});

export const aiNewsCreateResponseSchema = z.object({
  /** One per request item, in order. */
  results: z.array(
    z.discriminatedUnion('status', [
      z.object({
        status: z.literal('created'),
        id: z.number().int(),
        /** The canonical URL that was stored. */
        url: z.string(),
        slug: z.string(),
      }),
      /** The URL or the slug was already taken. */
      z.object({
        status: z.literal('duplicate'),
        url: z.string(),
        slug: z.string(),
      }),
    ]),
  ),
});

export type AiNewsCreateResponse = z.infer<typeof aiNewsCreateResponseSchema>;
