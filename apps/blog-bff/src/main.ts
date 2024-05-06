import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';

import { articles } from '@angular-love/blog-bff/articles/api';
import { authors } from '@angular-love/blog-bff/authors/api';

const app = new Hono();

app.use('*', cors());

app.use(
  '*',
  cache({
    wait: false,
    cacheName: 'al-bff',
    cacheControl: 'max-age=3600',
  }),
);

app.route('/articles', articles);
app.route('/authors', authors);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.text('Internal Server Error', 500);
});

export default app;
