import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';

import { articles } from '@angular-love/blog-bff/articles/api';
import { authors } from '@angular-love/blog-bff/authors/api';
import { newsletter } from '@angular-love/blog-bff/newsletter/api';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => {
  return c.json({ msg: 'test' });
});

app.route('/articles', articles);
app.route('/authors', authors);
app.route('/newsletter', newsletter);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.text('Internal Server Error', 500);
});

export default app;
