import { Hono } from 'hono';

import {
  appCache,
  langMw,
} from '@angular-love/blog-bff/shared/util-middleware';
import { ArrayResponse } from '@angular-love/blog-contracts/shared';
import { Page } from '@angular-love/blog/contracts/pages';
import { wpClientMw } from '@angular-love/util-wp';

import { toPage, toPageList } from './mappers';
import { WpPages } from './wp-pages';

const app = new Hono().use(appCache).use(wpClientMw).use(langMw());

app.get('/', async (c) => {
  const client = new WpPages(c.var.createWPClient());

  const result = await client.getPages();

  return c.json(<ArrayResponse<Page>>{
    data: toPageList(result.data),
    total: Number(result.headers.get('x-wp-total')),
  });
});

app.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const client = new WpPages(c.var.createWPClient());
  const result = await client.getBySlug(slug);

  return c.json(toPage(result.data[0]));
});

export default app;
