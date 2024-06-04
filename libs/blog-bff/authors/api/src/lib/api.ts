import { Hono } from 'hono';

import { ArrayResponse } from '@angular-love/blog-contracts/shared';
import { Author } from '@angular-love/blog/contracts/authors';
import { getPagination, wpClientMw } from '@angular-love/util-wp';

import { WPAuthorDto } from './dtos';
import { toAuthor } from './mappers';

const app = new Hono();

app.get('/', wpClientMw, async (c) => {
  const queryParams = c.req.query();
  const { per_page, page } = getPagination(queryParams);

  const query: Record<string, string | number> = {
    per_page,
    page,
  };

  const result = await c.var.wpClient.get<WPAuthorDto[]>('users', {
    ...query,
    _fields: 'id,type,slug,name,description,avatar_urls,acf',
  });

  return c.json(<ArrayResponse<Author>>{
    data: result.data.map(toAuthor),
    total: Number(result.headers.get('x-wp-total')),
  });
});

app.get('/:slug', wpClientMw, async (c) => {
  const slug = c.req.param('slug');

  const result = await c.var.wpClient.get<WPAuthorDto[]>('users', {
    slug: slug,
    _fields: 'id,type,slug,name,description,avatar_urls,acf',
  });

  return c.json(toAuthor(result.data[0]));
});

export default app;
