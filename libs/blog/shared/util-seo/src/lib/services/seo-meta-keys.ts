export const SEO_META_KEYS = {
  articleModifiedTime: 'article:modifiedd_time',
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
