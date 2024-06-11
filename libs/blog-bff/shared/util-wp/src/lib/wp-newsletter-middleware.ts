import { createMiddleware } from 'hono/factory';

import { WPRestClient } from './wp-client';

export const wpNewsletterClientMw = createMiddleware<{
  Bindings: {
    WP_REST_API_BASE_URL: string;
    WP_NEWSLETTER_CLIENT_KEY: string;
    WP_NEWSLETTER_CLIENT_SECRET: string;
  };
  Variables: { wpClientSubscriber: WPRestClient };
}>(async (c, next) => {
  const client_config = btoa(
    `${c.env.WP_NEWSLETTER_CLIENT_KEY + ':' + c.env.WP_NEWSLETTER_CLIENT_SECRET}`,
  );
  const token = `Basic ${client_config}`;

  const client = new WPRestClient(c.env.WP_REST_API_BASE_URL, {
    headers: {
      Authorization: token,
    },
  });

  c.set('wpClientSubscriber', client);

  await next();
});
