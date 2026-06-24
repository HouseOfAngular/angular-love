export const SEO_META_KEYS = {
  articleModifiedTime: 'article:modified_time',
  articlePublishedTime: 'article:published_time',
  articlePublisher: 'article:publisher',
  description: 'description',
  image: 'image',
  ogDescription: 'og:description',
  ogImage: 'og:image',
  ogImageHeight: 'og:image:height',
  ogImageWidth: 'og:image:width',
  ogLocale: 'og:locale',
  ogSiteName: 'og:site_name',
  ogType: 'og:type',
  ogURL: 'og:url',
  robots: 'robots',
  twitterCard: 'twitter:card',
  twitterDescription: 'twitter:description',
  twitterImage: 'twitter:image',
  twitterMiscData: 'twitter:data',
  twitterMiscLabel: 'twitter:label',
  twitterURL: 'twitter:url',
} as const;

export type SeoMetaKeys = keyof typeof SEO_META_KEYS;

/**
 * Site-wide BASE tags. Applied on every navigation (including store-managed
 * article routes), with constant keys + values, so `Meta.updateTag` overwrites
 * them idempotently. They are NEVER removed during a navigation — page seo only
 * overwrites the shared ones (description trio + og:type).
 */
export const BASE_META_KEYS: SeoMetaKeys[] = [
  'ogLocale',
  'ogSiteName',
  'ogType',
  'description',
  'ogDescription',
  'twitterDescription',
];

/**
 * Page-specific tags removed by `resetPageSeo()` before a new page's seo is
 * applied. Everything in SEO_META_KEYS that is not part of the BASE layer.
 */
export const PAGE_REMOVABLE_META_KEYS: SeoMetaKeys[] = (
  Object.keys(SEO_META_KEYS) as SeoMetaKeys[]
).filter((key) => !BASE_META_KEYS.includes(key));
