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
 * Truly site-wide BASE tags — exactly the keys `SeoService.applyBaseSeo()`
 * reapplies (with constant values) on every navigation, including store-managed
 * routes. They are NEVER removed by `resetPageSeo()`. Page-level tags such as
 * the description trio and og:type are NOT listed here: they are page-specific
 * (central pages reapply them after reset; stores set their own), so leaving
 * them out lets `resetPageSeo()` clear them and prevents stale leakage between
 * navigations.
 */
export const BASE_META_KEYS: SeoMetaKeys[] = ['ogLocale', 'ogSiteName'];

/**
 * Page-specific tags removed by `resetPageSeo()` before a new page's seo is
 * applied. Everything in SEO_META_KEYS that is not part of the BASE layer.
 */
export const PAGE_REMOVABLE_META_KEYS: SeoMetaKeys[] = (
  Object.keys(SEO_META_KEYS) as SeoMetaKeys[]
).filter((key) => !BASE_META_KEYS.includes(key));
