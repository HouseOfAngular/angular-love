import { Context } from 'hono';

import { Lang, LangSchema } from '@angular-love/shared/utils-i18n';

export const getWpLang = (c: Context): Lang =>
  LangSchema.parse(c.req.header('x-al-lang'));
