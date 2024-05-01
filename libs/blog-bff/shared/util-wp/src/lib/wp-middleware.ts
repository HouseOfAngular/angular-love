import { createMiddleware } from 'hono/factory';

import { ALWPRestClient } from './al-wp-client';
import { WPArticles } from './articles';

export const wpClientMw = createMiddleware<{
  Bindings: { WP_REST_API_TOKEN: string; WP_REST_API_BASE_URL: string };
  Variables: {
    wpClient: {
      articles: WPArticles;
    };
  };
}>(async (c, next) => {
  const token = c.env.WP_REST_API_TOKEN;
  if (!token) throw 'Token is not defined!';

  const client = new ALWPRestClient(c.env.WP_REST_API_BASE_URL, {
    headers: {
      Authorization: token,
    },
  });

  c.set('wpClient', {
    articles: new WPArticles(client),
  });

  await next();
});
