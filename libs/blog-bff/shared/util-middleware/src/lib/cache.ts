import { env } from 'hono/adapter';
import { createMiddleware } from 'hono/factory';

import { kvCache } from './kv-cache';
import { getWpLang } from './lang';

type Env = {
  Bindings: {
    DISABLE_CACHE?: string;
    CACHE_KV: KVNamespace;
  };
};

export const appCache = createMiddleware<Env>((c, next) => {
  if (env(c)['DISABLE_CACHE']) {
    return next();
  }
  return kvCache({
    kvNamespace: env(c).CACHE_KV,
    keyGenerator: (c) => `${c.req.url}_${getWpLang(c, 'en')}`,
  })(c, next);
});
