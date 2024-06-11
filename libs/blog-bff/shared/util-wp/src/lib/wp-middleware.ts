import { createMiddleware } from 'hono/factory';

import { WPRestClient } from './wp-client';

export const wpClientMw = createMiddleware<{
  Bindings: {
    WP_REST_API_TOKEN: string;
    WP_REST_API_BASE_URL: string;
  };
  Variables: { wpClient: WPRestClient };
}>(async (c, next) => {
  const token = c.env.WP_REST_API_TOKEN;
  if (!token) throw 'Token is not defined!';

  const client = new WPRestClient(c.env.WP_REST_API_BASE_URL, {
    headers: {
      Authorization: token,
    },
  });

  c.set('wpClient', client);

  await next();
});
