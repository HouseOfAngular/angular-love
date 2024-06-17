import { createMiddleware } from 'hono/factory';

import { createWPRestClientFactory, WPClientFactory } from './wp-client';

export const wpClientMw = createMiddleware<{
  Bindings: {
    WP_REST_API_TOKEN: string;
    WP_REST_API_BASE_URL: string;
  };
  Variables: { createWPClient: WPClientFactory };
}>(async (c, next) => {
  const token = c.env.WP_REST_API_TOKEN;
  if (!token) throw 'Token is not defined!';

  const factory = createWPRestClientFactory(c.env.WP_REST_API_BASE_URL, {
    headers: {
      Authorization: token,
    },
  });

  c.set('createWPClient', factory);

  await next();
});
