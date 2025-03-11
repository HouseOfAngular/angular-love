import * as v from 'valibot';

export const enum DbLang {
  English = 1,
  Polish = 2,
}

export const dbLocaleMap = {
  en_GB: DbLang.English,
  pl_PL: DbLang.Polish,
} as const;

export const dbLangMap = {
  en: DbLang.English,
  pl: DbLang.Polish,
} as const;

export const LangSchema = v.picklist(['pl', 'en'], 'Invalid lang');

export type Lang = v.InferInput<typeof LangSchema>;
