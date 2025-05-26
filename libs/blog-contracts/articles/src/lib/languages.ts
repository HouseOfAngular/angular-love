import * as v from 'valibot';

export const enum DbLang {
  English = 1,
  Polish = 2,
}

export const LangSchema = v.picklist(['pl', 'en'], 'Invalid lang');

export type Lang = v.InferInput<typeof LangSchema>;
