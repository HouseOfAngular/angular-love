import { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

import { Lang, LangSchema } from '@angular-love/shared/utils-i18n';

export const getWpLang = (c: Context, fallback?: Lang): Lang => {
  const schema = fallback ? LangSchema.default(fallback) : LangSchema;
  return schema.parse(c.req.query()['lang'] || c.req.header('x-al-lang'));
};

/**
 * Middleware to parse the language from the request headers.
 * Sets the `lang` variable in the context.
 * @param throwOnInvalidLang - If true, throws an error if the lang is invalid
 */
export const langMw = (throwOnInvalidLang = false) =>
  createMiddleware<{
    Variables: { lang: Lang };
  }>((c, next) => {
    try {
      const lang = getWpLang(c);
      c.set('lang', lang);
    } catch (e) {
      if (throwOnInvalidLang) {
        throw new HTTPException(400, { message: 'Invalid lang' });
      } else {
        c.set('lang', 'en');
      }
    }

    return next();
  });
