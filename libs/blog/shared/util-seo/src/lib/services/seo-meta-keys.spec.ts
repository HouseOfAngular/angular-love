import { isNameScopedMetaTag, SEO_META_KEYS } from './seo-meta-keys';

describe('isNameScopedMetaTag', () => {
  it.each([
    // Google reads these only from the `name` attribute.
    { tag: SEO_META_KEYS.description },
    { tag: SEO_META_KEYS.robots },
    // The Twitter card spec defines name="twitter:*".
    { tag: SEO_META_KEYS.twitterCard },
    { tag: SEO_META_KEYS.twitterDescription },
    { tag: SEO_META_KEYS.twitterImage },
    { tag: SEO_META_KEYS.twitterURL },
    { tag: 'twitter:title' },
    { tag: `${SEO_META_KEYS.twitterMiscLabel}1` },
    { tag: `${SEO_META_KEYS.twitterMiscData}2` },
  ])('$tag is name-scoped', ({ tag }) => {
    expect(isNameScopedMetaTag(tag)).toBe(true);
  });

  it.each([
    // OpenGraph and its article:* namespace belong in `property`.
    { tag: SEO_META_KEYS.ogDescription },
    { tag: SEO_META_KEYS.ogType },
    { tag: SEO_META_KEYS.ogURL },
    { tag: SEO_META_KEYS.ogLocale },
    { tag: SEO_META_KEYS.ogSiteName },
    { tag: SEO_META_KEYS.ogImage },
    { tag: SEO_META_KEYS.articlePublishedTime },
    { tag: SEO_META_KEYS.articleModifiedTime },
    { tag: SEO_META_KEYS.articlePublisher },
    { tag: 'og:title' },
  ])('$tag is property-scoped', ({ tag }) => {
    expect(isNameScopedMetaTag(tag)).toBe(false);
  });

  it('does not treat og:description as a twitter tag', () => {
    expect(isNameScopedMetaTag('og:description')).toBe(false);
    expect(isNameScopedMetaTag('twitter:description')).toBe(true);
  });
});
