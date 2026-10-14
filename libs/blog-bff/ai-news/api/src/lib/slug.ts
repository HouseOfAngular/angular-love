/** Lowercase words joined by single dashes, as stored in `ai_news_items.slug`. */
export const AI_NEWS_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const AI_NEWS_SLUG_MAX_LENGTH = 100;

/** `Angular 21: Signal Forms!` → `angular-21-signal-forms`. */
export function slugify(text: string): string {
  return (
    text
      .normalize('NFKD')
      // The accents NFKD split off.
      .replace(/\p{M}/gu, '')
      // Not decomposed by NFKD.
      .replace(/ł/g, 'l')
      .replace(/Ł/g, 'L')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, AI_NEWS_SLUG_MAX_LENGTH)
      .replace(/^-+|-+$/g, '') || 'news'
  );
}
