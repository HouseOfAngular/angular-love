import { defineEventHandler, getQuery, getRouterParam } from 'h3';

import {
  toArticlePreviewList,
  WpPosts,
} from '@angular-love/blog-bff/articles/api';

import { getLang } from '../../../../utils/lang';
import { createWpClient } from '../../../../utils/wp-client';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  const { limit } = getQuery(event) as Record<string, string>;
  const query: Record<string, string | number> = {
    lang: getLang(event),
    limit: limit || 2,
  };

  const createWPClient = createWpClient(event);

  const client = new WpPosts(createWPClient({ namespace: 'yarpp/v1' }));

  const result = await client.getRelatedPosts(id, query);

  return {
    data: toArticlePreviewList(result.data),
    total: Number(result.headers.get('x-wp-total')),
  };
});
