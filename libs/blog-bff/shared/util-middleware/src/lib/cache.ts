import { cache } from 'hono/cache';
import { createMiddleware } from 'hono/factory';

import { getWpLang } from './lang';

export const appCache = createMiddleware(
  cache({
    wait: false,
    cacheName: 'al-bff',
    cacheControl: 'max-age=3600',
    keyGenerator: (c) => `${c.req.url}_${getWpLang(c, 'en')}`,
    vary: 'x-al-lang',
  }),
);
