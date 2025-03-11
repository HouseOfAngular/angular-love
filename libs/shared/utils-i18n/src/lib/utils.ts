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
