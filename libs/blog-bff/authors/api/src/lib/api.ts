import { Hono } from 'hono';

import {
  appCache,
  langMw,
} from '@angular-love/blog-bff/shared/util-middleware';
import { ArrayResponse } from '@angular-love/blog-contracts/shared';
import { Author } from '@angular-love/blog/contracts/authors';
import { getPagination, wpClientMw } from '@angular-love/util-wp';

import { toAuthor } from './mappers';
import { WpAuthors } from './wp-authors';

const app = new Hono().use(appCache).use(wpClientMw).use(langMw());

app.get('/', async (c) => {
  const queryParams = c.req.query();
  const client = new WpAuthors(c.var.createWPClient());
  const { per_page, page } = getPagination(queryParams);

  const query: Record<string, string | number> = {
    per_page,
    page,
  };

  const result = await client.getAuthors(query);

  return c.json(<ArrayResponse<Author>>{
    data: result.data.map((dto) => toAuthor(dto)),
    total: Number(result.headers.get('x-wp-total')),
  });
});

app.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const client = new WpAuthors(c.var.createWPClient());

  const result = await client.getBySlug(slug);

  return c.json(toAuthor(result.data[0]));
});

export default app;
