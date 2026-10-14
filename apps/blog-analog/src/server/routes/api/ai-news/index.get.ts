import { createError, defineEventHandler, getQuery } from 'h3';
import * as z from 'zod';

import {
  aiNewsFeedQuerySchema,
  aiNewsFeedResponseSchema,
  decodeCursor,
  getAiNewsFeed,
} from '@angular-love/blog-bff/ai-news/api';
import { AiNewsFeedResponse } from '@angular-love/blog/contracts/ai-news';

import { createDatabase } from '../../../utils/database';

export default defineEventHandler(
  async (event): Promise<AiNewsFeedResponse> => {
    const query = aiNewsFeedQuerySchema.safeParse(getQuery(event));
    if (!query.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid query',
        data: z.flattenError(query.error).fieldErrors,
      });
    }

    const { limit, category, cursor } = query.data;
    const decodedCursor = cursor ? decodeCursor(cursor) : null;
    if (cursor && !decodedCursor) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid cursor' });
    }

    const feed = await getAiNewsFeed(createDatabase(event), {
      limit,
      category,
      cursor: decodedCursor,
    });

    return aiNewsFeedResponseSchema.parse(feed);
  },
);
