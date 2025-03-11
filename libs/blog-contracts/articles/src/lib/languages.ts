import * as v from 'valibot';

export const LangSchema = v.picklist(['pl', 'en'], 'Invalid lang');

export type Lang = v.InferInput<typeof LangSchema>;
