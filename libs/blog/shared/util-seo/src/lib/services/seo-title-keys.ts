export const SEO_TITLE_KEYS = {
  name: 'name',
  ogTitle: 'og:title',
  twitterTitle: 'twitter:title',
} as const;

export type SeoTitleKeys = keyof typeof SEO_TITLE_KEYS;
