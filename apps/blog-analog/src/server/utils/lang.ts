import { createError, getQuery, getRequestHeader, H3Event } from 'h3';
import * as v from 'valibot';

import { Lang, LangSchema } from '@angular-love/contracts/articles';

/**
 * Parses the language from query param `lang` or `x-al-lang` header.
 * Adapted from the Hono `langMw` in `libs/blog-bff/shared/util-middleware/lang.ts`.
 *
 * @param throwOnInvalid - If true, throws a 400 error on invalid/missing lang.
 *                         If false (default), falls back to 'en'.
 */
export function getLang(event: H3Event, throwOnInvalid = false): Lang {
  const query = getQuery(event);
  const langValue =
    (query['lang'] as string) || getRequestHeader(event, 'x-al-lang');

  try {
    return v.parse(LangSchema, langValue);
  } catch {
    if (throwOnInvalid) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid lang' });
    }
    return 'en';
  }
}
