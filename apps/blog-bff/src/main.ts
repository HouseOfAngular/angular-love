import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';

import { articles } from '@angular-love/blog-bff/articles/api';
import { authors } from '@angular-love/blog-bff/authors/api';
import { banners } from '@angular-love/blog-bff/banners/api';
import { newsletter } from '@angular-love/blog-bff/newsletter/api';

const app = new Hono();

app.use('*', cors());

app.route('/articles', articles);
app.route('/authors', authors);
app.route('/newsletter', newsletter);
app.route('/banners', banners);

app.get('/robots.txt', (c) => {
  const robotsTxt = `User-agent: *
Disallow: /`;
  return c.text(robotsTxt, 200, {
    'Content-Type': 'text/plain',
  });
});

app.onError((err, c) => {
  console.error(err);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.text('Internal Server Error', 500);
});

export default app;
