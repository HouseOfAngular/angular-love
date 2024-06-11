import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';
import { z, ZodError } from 'zod';

import { wpNewsletterClientMw } from '@angular-love/util-wp';

const app = new Hono();

app.use(
  '*',
  csrf({
    origin: (origin, c) =>
      c.env['IS_PROD'] === 'true'
        ? /https:\/\/(\w+\.)?(angular\.love|angular-love-client\.pages\.dev)$/.test(
            origin,
          )
        : true,
  }),
);

const emailSchema = z.string().email({ message: 'Invalid email address' });

app.post('/', wpNewsletterClientMw, async (c) => {
  const newSubscriber = await c.req.text();

  try {
    const parsedNewSubscriber = emailSchema.parse(newSubscriber);
    const res = await c.var.wpClientSubscriber.post(
      'email',
      parsedNewSubscriber,
    );
    return c.json(res);
  } catch (e) {
    if (e instanceof ZodError) {
      return c.json('Email validation error', 400);
    }
    if (e instanceof HTTPException) {
      return c.json('Post method fail', 400);
    }
    return c.json('Unknown error', 400);
  }
});

export default app;
