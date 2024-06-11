import { Context } from 'hono';
import * as z from 'zod';

const WPLangSchema = z.enum(['pl', 'en']).default('en');

export type WPLang = z.infer<typeof WPLangSchema>;

export const getWpLang = (c: Context): WPLang =>
  WPLangSchema.parse(c.req.header('X-AL-Lang'));
