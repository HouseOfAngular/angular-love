import { Hono } from 'hono';

import {
  ArrayResponse,
  ArticlePreview,
} from '@angular-love/contracts/articles';
import { wpClientMw } from '@angular-love/util-wp';

import { toArticle, toArticlePreviewList } from './mappers';

const app = new Hono();

const defaultQuery = {
  skip: '0',
  take: '10',
  lang: 'en',
};

app.get('/', wpClientMw, async (c) => {
  const queryParams = c.req.query();

  const take = queryParams.take || defaultQuery.take;
  const skip = queryParams.skip || defaultQuery.skip;
  const page = Math.floor(Number(skip) / Number(take)) + 1;

  const result = await c.var.wpClient.articles.getAll({
    lang: queryParams.lang || defaultQuery.lang,
    per_page: take,
    page: page.toString(),
    author_slug: queryParams.authorSlug,
  });

  return c.json(<ArrayResponse<ArticlePreview>>{
    data: toArticlePreviewList(result.data),
    total: Number(result.headers.get('x-wp-total')),
  });
});

app.get('/:slug', wpClientMw, async (c) => {
  const slug = c.req.param('slug');

  const result = await c.var.wpClient.articles.getBySlug(slug);

  return c.json(toArticle(result.data[0]));
});

export default app;
