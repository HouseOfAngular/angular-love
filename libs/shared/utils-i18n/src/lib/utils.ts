import * as z from 'zod';

export const LangSchema = z.enum(['pl', 'en'], { message: 'Invalid lang' });

export type Lang = z.infer<typeof LangSchema>;

export function convertLangToLocale(lang: string) {
  switch (lang) {
    case 'pl':
      return 'pl_PL';
    case 'en':
      return 'en_US';
    default:
      throw new Error(`Unsupported lang: ${lang}`);
  }
}
