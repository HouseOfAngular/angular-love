import { createMiddleware } from 'hono/dist/types/helper/factory';
import { cache } from 'hono/dist/types/middleware/cache';

import { getWpLang } from '@angular-love/util-wp';

export const appCache = createMiddleware(
  cache({
    wait: false,
    cacheName: 'al-bff',
    cacheControl: 'max-age=3600',
    keyGenerator: (c) => `${c.req.url}_${getWpLang(c)}`,
    vary: 'x-al-lang',
  }),
);
