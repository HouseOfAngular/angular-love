// https://github.com/analogjs/analog/blob/553790b242b5435a54bb962a002a5b0ea612d934/packages/router/src/lib/request-context.ts
import { injectAPIPrefix, injectBaseURL } from '@analogjs/router/tokens';
import {
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject, makeStateKey, TransferState } from '@angular/core';
import { from, of } from 'rxjs';

import { makeCacheKey } from './cache-key';

/**
 * PATCHED ANALOGJS REQUEST CONTEXT INTERCEPTOR
 *
 * THE PROBLEM:
 * The original AnalogJS interceptor has two critical bugs when deploying SSR to
 * strict V8 edge environments like Cloudflare Workers:
 *
 * 1. The Serialization Bug (Dropped Query Params):
 * During SSR, Analog intercepts internal API calls and routes them to Nitro via `global.$fetch`.
 * It extracts `requestUrl.searchParams` and passes it to Nitro's `ofetch`. However, in
 * Cloudflare's strict V8 environment, `URLSearchParams` is an iterable interface, not a plain
 * object. `ofetch` fails to iterate over it, completely stripping all query parameters
 * before hitting the backend (e.g., `?take=3` becomes `{}`).
 *
 * 2. The TransferState Cache Collision:
 * Analog generates the HTML TransferState cache key using *only* `URL.pathname`. Therefore,
 * requests like `/api/articles?take=8` and `/api/articles?category=recommended&take=3`
 * generate the exact same cache key. They overwrite each other on the server, causing
 * redundant network requests and double-hydration bugs on the client browser.
 *
 * WHEN IT OCCURS:
 * This only happens in production/preview builds deployed to Cloudflare (`wrangler dev` or Workers).
 * It works magically fine locally (`nx serve`) because the Vite dev server does not inject
 * `global.$fetch`, causing the execution to bypass the buggy server block entirely and fall
 * back to native Angular HTTP behavior.
 *
 * THE FIX:
 * - Server Block: Swapped `req.url` for `req.urlWithParams`. Baked the query string directly
 * into the `fetchUrl` string (bypassing the `URLSearchParams` issue entirely) and included it
 * in the cache key generation to prevent data collisions.
 * - Client Block: Separated the Analog cache lookup (which must use `urlWithParams` to match
 * the new server cache key) from the downstream request (which must revert to `req.url` so
 * Angular's native HTTP pipeline doesn't double-serialize the `req.params` object).
 */
export function appRequestContextInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const apiPrefix = injectAPIPrefix();
  const baseUrl = injectBaseURL();
  const transferState = inject(TransferState);

  // during prerendering with Nitro
  if (
    typeof global !== 'undefined' &&
    global.$fetch &&
    baseUrl &&
    (req.url.startsWith('/') ||
      req.url.startsWith(baseUrl) ||
      req.url.startsWith(`/${apiPrefix}`))
  ) {
    // use `req.urlWithParams` instead of `req.url`
    const requestUrl = new URL(req.urlWithParams, baseUrl);

    // bake the search query into the fetch URL (e.g., "/api/articles?take=3")
    const fetchUrl = requestUrl.pathname + requestUrl.search;

    // use the full fetchUrl for the cache key so they don't collide
    const cacheKey = makeCacheKey(req, fetchUrl);
    const storeKey = makeStateKey<unknown>(`analog_${cacheKey}`);

    const responseType =
      req.responseType === 'arraybuffer' ? 'arrayBuffer' : req.responseType;

    return from(
      global.$fetch
        .raw(fetchUrl, {
          method: req.method as any,
          body: req.body ? req.body : undefined,
          // removed `params` as it's passed in `fetchUrl`
          responseType,
          headers: req.headers.keys().reduce((hdrs, current) => {
            return {
              ...hdrs,
              [current]: req.headers.get(current),
            };
          }, {}),
        })
        .then((res) => {
          const cacheResponse = {
            body: res._data,
            headers: new HttpHeaders(res.headers),
            status: 200,
            statusText: 'OK',
            url: fetchUrl, // save the full URL in cache
          };
          const transferResponse = new HttpResponse(cacheResponse);

          transferState.set(storeKey, cacheResponse);
          return transferResponse;
        }),
    );
  }

  // on the client
  if (
    !import.meta.env.SSR &&
    (req.url.startsWith('/') || req.url.includes('/_analog/'))
  ) {
    // use urlWithParams to match our Cloudflare $fetch fix
    const cacheLookupUrl = req.urlWithParams.includes('/_analog/')
      ? req.urlWithParams
      : `${window.location.origin}${req.urlWithParams}`;

    const parsedLookupUrl = new URL(cacheLookupUrl);

    // append the search string so it perfectly matches the server's cache key
    const cacheKey = makeCacheKey(
      req,
      parsedLookupUrl.pathname + parsedLookupUrl.search,
    );
    const storeKey = makeStateKey<unknown>(`analog_${cacheKey}`);
    const cacheRestoreResponse = transferState.get(storeKey, null);

    if (cacheRestoreResponse) {
      transferState.remove(storeKey);
      return of(new HttpResponse(cacheRestoreResponse));
    }

    // downstream request - revert to req.url so Angular's native HttpTransferCache
    // and XHR backend can safely combine it with the intact req.params object
    const requestUrl = req.url.includes('/_analog/')
      ? req.url
      : `${window.location.origin}${req.url}`;

    return next(
      req.clone({
        url: requestUrl,
      }),
    );
  }

  // on the server
  if (baseUrl && (req.url.startsWith('/') || req.url.startsWith(baseUrl))) {
    const requestUrl =
      req.url.startsWith(baseUrl) && !req.url.startsWith('/')
        ? req.url
        : `${baseUrl}${req.url}`;

    return next(
      req.clone({
        url: requestUrl,
      }),
    );
  }

  return next(req);
}
