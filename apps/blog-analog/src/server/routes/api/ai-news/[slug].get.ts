import { createError, defineEventHandler, getRouterParam } from 'h3';

import {
  aiNewsItemDetailSchema,
  aiNewsSlugParamSchema,
  getAiNewsItem,
} from '@angular-love/blog-bff/ai-news/api';
import { AiNewsItemDetail } from '@angular-love/blog/contracts/ai-news';

import { createDatabase } from '../../../utils/database';

export default defineEventHandler(async (event): Promise<AiNewsItemDetail> => {
  const slug = aiNewsSlugParamSchema.safeParse(getRouterParam(event, 'slug'));
  if (!slug.success) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' });
  }

  const item = await getAiNewsItem(createDatabase(event), slug.data);
  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' });
  }

  return aiNewsItemDetailSchema.parse(item);
});
