import { Hono } from 'hono';

import { wpClientMw } from '@angular-love/util-wp';

import { WPAuthorDto } from './dtos';
import { toAuthor } from './mappers';

const app = new Hono();

app.get('/:slug', wpClientMw, async (c) => {
  const slug = c.req.param('slug');

  const result = await c.var.wpClient.get<WPAuthorDto[]>('users', {
    slug: slug,
    _fields: 'id,type,slug,name,description,avatar_urls',
  });

  return c.json(toAuthor(result.data[0]));
});

export default app;
