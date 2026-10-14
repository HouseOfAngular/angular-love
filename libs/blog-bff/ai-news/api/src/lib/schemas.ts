import * as z from 'zod';

import {
  AI_NEWS_CATEGORIES,
  AI_NEWS_DEFAULT_LIMIT,
  AI_NEWS_MAX_LIMIT,
  AI_NEWS_SOURCE_TYPES,
  AI_NEWS_STATUSES,
  AI_NEWS_SUMMARY_MAX_LENGTH,
  AiNewsFeedResponse,
} from '@angular-love/blog/contracts/ai-news';

export const aiNewsSourceTypeSchema = z.enum(AI_NEWS_SOURCE_TYPES);
export const aiNewsCategorySchema = z.enum(AI_NEWS_CATEGORIES);
export const aiNewsStatusSchema = z.enum(AI_NEWS_STATUSES);

/** An item as it is written to the database (seed, future ingestion). */
export const aiNewsItemInputSchema = z.object({
  url: z.url({ protocol: /^https?$/ }).max(2048),
  title: z.string().trim().min(1).max(300),
  // Length is enforced here only, never in the database.
  summary: z.string().trim().min(1).max(AI_NEWS_SUMMARY_MAX_LENGTH),
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
  title: z.string(),
  summary: z.string(),
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
    z.object({
      id: z.number().int(),
      /** The canonical URL that was stored or matched. */
      url: z.string(),
      status: z.enum(['created', 'duplicate']),
    }),
  ),
});

export type AiNewsCreateResponse = z.infer<typeof aiNewsCreateResponseSchema>;
