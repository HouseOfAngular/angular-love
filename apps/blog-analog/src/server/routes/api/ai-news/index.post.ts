import {
  createError,
  defineEventHandler,
  readBody,
  setResponseHeader,
  setResponseStatus,
} from 'h3';
import * as z from 'zod';

import {
  aiNewsCreateRequestSchema,
  AiNewsCreateResponse,
  aiNewsCreateResponseSchema,
  insertAiNewsItems,
} from '@angular-love/blog-bff/ai-news/api';

import { hasBearerToken } from '../../../utils/bearer-token';
import { createWriteDatabase } from '../../../utils/database';
import { getOptionalEnv } from '../../../utils/env';

/**
 * Adds AI news items. Needs `Authorization: Bearer <AI_NEWS_INGEST_TOKEN>`.
 * Responds 201 when at least one item was created, 200 when all were
 * duplicates, with a result per item.
 */
export default defineEventHandler(
  async (event): Promise<AiNewsCreateResponse> => {
    if (!hasBearerToken(event, getOptionalEnv(event, 'AI_NEWS_INGEST_TOKEN'))) {
      setResponseHeader(event, 'WWW-Authenticate', 'Bearer');
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    const body = aiNewsCreateRequestSchema.safeParse(await readBody(event));
    if (!body.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid body',
        data: z.treeifyError(body.error),
      });
    }

    const results = await insertAiNewsItems(
      createWriteDatabase(event),
      body.data.items,
    );

    setResponseStatus(
      event,
      results.some((result) => result.status === 'created') ? 201 : 200,
    );
    return aiNewsCreateResponseSchema.parse({ results });
  },
);
