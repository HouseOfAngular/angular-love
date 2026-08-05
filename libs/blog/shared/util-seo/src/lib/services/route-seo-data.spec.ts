import { interpretRouteSeo } from './route-seo-data';

describe('interpretRouteSeo', () => {
  it('treats seo:false as store-managed (no central page seo / JSON-LD)', () => {
    const result = interpretRouteSeo({ seo: false });
    expect(result.managedExternally).toBe(true);
    expect(result.applyJsonLd).toBe(false);
    expect(result.autoHrefLang).toBe(false);
  });

  it('treats a missing seo as defaults-only (no JSON-LD, not managed)', () => {
    const result = interpretRouteSeo({});
    expect(result.managedExternally).toBe(false);
    expect(result.applyJsonLd).toBe(false);
    expect(result.jsonLdType).toBeUndefined();
  });

  it('suppresses JSON-LD when jsonLd:false but still manages meta centrally', () => {
    const result = interpretRouteSeo({
      seo: { title: 'Search Results', jsonLd: false },
    });
    expect(result.managedExternally).toBe(false);
    expect(result.applyJsonLd).toBe(false);
    expect(result.titleKey).toBe('Search Results');
  });

  it('emits the base graph only when seo is present without a jsonLd type', () => {
    const result = interpretRouteSeo({ seo: { title: 'seo.roadmap' } });
    expect(result.applyJsonLd).toBe(true);
    expect(result.jsonLdType).toBeUndefined();
  });

  it('resolves a valid WebPageType', () => {
    const result = interpretRouteSeo({
      seo: { title: 'seo.aboutUs', autoHrefLang: true, jsonLd: 'AboutPage' },
    });
    expect(result.jsonLdType).toBe('AboutPage');
    expect(result.applyJsonLd).toBe(true);
    expect(result.autoHrefLang).toBe(true);
    expect(result.titleKey).toBe('seo.aboutUs');
  });

  it('ignores an unknown jsonLd type (falls back to base graph)', () => {
    const result = interpretRouteSeo({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      seo: { jsonLd: 'NotARealType' as any },
    });
    expect(result.jsonLdType).toBeUndefined();
    expect(result.applyJsonLd).toBe(true);
  });

  it('defaults aboutOrganization to false', () => {
    expect(
      interpretRouteSeo({ seo: { jsonLd: 'WebPage' } }).aboutOrganization,
    ).toBe(false);
    expect(interpretRouteSeo({ seo: false }).aboutOrganization).toBe(false);
    expect(interpretRouteSeo({}).aboutOrganization).toBe(false);
  });

  it('surfaces aboutOrganization for the homepage', () => {
    const result = interpretRouteSeo({
      seo: { title: 'seo.home', jsonLd: 'WebPage', aboutOrganization: true },
    });
    expect(result.aboutOrganization).toBe(true);
  });

  it('surfaces route.data.title as the collection name', () => {
    const result = interpretRouteSeo({
      seo: { title: 'News', jsonLd: 'CollectionPage' },
      title: 'Angular News',
    });
    expect(result.jsonLdType).toBe('CollectionPage');
    expect(result.collectionTitle).toBe('Angular News');
  });
});
