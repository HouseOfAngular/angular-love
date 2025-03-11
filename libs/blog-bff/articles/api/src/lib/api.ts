import { Hono } from 'hono';

import {
  databaseMw,
  langMw,
} from '@angular-love/blog-bff/shared/util-middleware';
import { ArrayResponse } from '@angular-love/blog-contracts/shared';
import { ArticlePreview } from '@angular-love/contracts/articles';
import { getPagination, wpClientMw } from '@angular-love/util-wp';

import { toArticle, toArticlePreviewList } from './mappers';
import { WpPosts } from './wp-posts';

const app = new Hono().use(langMw()).use(databaseMw).use(wpClientMw);

app.get('/', async (c) => {
  const client = new WpPosts(c.var.createWPClient());
  const queryParams = c.req.query();

  const { per_page, page } = getPagination(queryParams);

  const query: Record<string, string | number> = {
    lang: c.var.lang,
    per_page,
    page,
  };

  queryParams.authorSlug && (query.author_slug = queryParams.authorSlug);
  queryParams.category && (query.category_slug = queryParams.category);
  queryParams.excludeRecent &&
    (query.exclude_recent = queryParams.excludeRecent);
  queryParams.excludeCategory &&
    (query.exclude_category = queryParams.excludeCategory);

  const result = await client.getPosts(query);

  return c.json(<ArrayResponse<ArticlePreview>>{
    data: toArticlePreviewList(result.data),
    total: Number(result.headers.get('x-wp-total')),
  });
});

app.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const client = new WpPosts(c.var.createWPClient({ namespace: 'al/v1' }));

  const result = await client.getBySlug(slug);

  return c.json(toArticle(result.data));
});

app.get('/:id/related', async (c) => {
  const id = c.req.param('id');
  const limit = c.req.query('limit');

  const query: Record<string, string | number> = {
    lang: c.var.lang,
    limit: limit || 2,
  };

  const client = new WpPosts(c.var.createWPClient({ namespace: 'yarpp/v1' }));

  const result = await client.getRelatedPosts(id, query);

  return c.json(<ArrayResponse<ArticlePreview>>{
    data: toArticlePreviewList(result.data),
    total: Number(result.headers.get('x-wp-total')),
  });
});

export default app;
