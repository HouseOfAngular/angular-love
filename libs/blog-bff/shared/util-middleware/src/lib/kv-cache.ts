import type { Context, MiddlewareHandler } from 'hono';

/**
 * KV Cache Middleware based on `hono/cache` built for Cache API.
 *
 * @param {Object} options - The options for the KV cache middleware.
 * @param {KVNamespace} options.kvNamespace - The KV namespace to use for caching.
 * @param {string} [options.cacheKeyPrefix] - A prefix to add to cache keys.
 * @param {Function} [options.keyGenerator] - A function to generate cache keys.
 * @param {number} [options.ttl=3600] - Time-to-live for cached items in seconds.
 * @returns {MiddlewareHandler} The middleware handler function.
 */
export const kvCache = (options: {
  kvNamespace: KVNamespace;
  cacheKeyPrefix?: string;
  keyGenerator?: (c: Context) => Promise<string> | string;
  ttl?: number; // TTL in seconds
}): MiddlewareHandler => {
  return async function kvCache(c, next) {
    let key = c.req.url;
    if (options.keyGenerator) {
      key = await options.keyGenerator(c);
    }

    if (options.cacheKeyPrefix) {
      key = options.cacheKeyPrefix + key;
    }

    // Attempt to retrieve the cached response
    const cachedResponseBody = await options.kvNamespace.get(
      key,
      'arrayBuffer',
    );
    if (cachedResponseBody) {
      // Retrieve stored headers
      const cachedHeadersJson = await options.kvNamespace.get(key + ':headers');
      const headers = new Headers();
      if (cachedHeadersJson) {
        const headersObj = JSON.parse(cachedHeadersJson);
        for (const [k, v] of Object.entries(headersObj)) {
          headers.set(k, v as string);
        }
      }
      return new Response(cachedResponseBody, { headers });
    }

    // Proceed to the next middleware or handler
    await next();

    // Cache the response if it's successful
    if (!c.res.ok) {
      return;
    }

    // Clone the response to read its body
    const resClone = c.res.clone();
    const resBody = await resClone.arrayBuffer();

    // Store the response body and headers in KV
    const ttl = options.ttl || 3600; // Default TTL is 1 hour
    await options.kvNamespace.put(key, resBody, { expirationTtl: ttl });

    const headersObj: Record<string, string> = {};
    for (const [k, v] of resClone.headers.entries()) {
      headersObj[k] = v;
    }
    await options.kvNamespace.put(
      key + ':headers',
      JSON.stringify(headersObj),
      { expirationTtl: ttl },
    );
  };
};
