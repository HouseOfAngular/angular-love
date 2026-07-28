import { DbLang } from '@angular-love/contracts/articles';

import {
  buildBlogPosting,
  buildBreadcrumbList,
  buildHomeBreadcrumb,
  buildOrganization,
  buildOrganizationId,
  buildPageGraph,
  buildPerson,
  buildPersonId,
  buildWebPage,
  buildWebPageId,
  buildWebSite,
  serializeJsonLd,
} from './json-ld.builders';
import { SchemaGraphEntity, SchemaWebPage } from './json-ld.types';

const BASE_URL = 'https://angular.love';
const SITE_NAME = 'Angular.love';
const IN_LANGUAGE = ['en', 'pl'];
const HOME = { name: 'Home', url: `${BASE_URL}/` };
const HOME_PL = { name: 'Strona główna', url: `${BASE_URL}/pl` };

const makeAuthor = (
  overrides: Partial<{
    github: string | null;
    twitter: string | null;
    linkedin: string | null;
  }> = {},
) => ({
  name: 'Jane Dev',
  slug: 'jane-dev',
  description: 'Angular expert',
  avatarUrl: 'https://wp.angular.love/avatar.jpg',
  position: 'Developer',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  titles: [] as any[],
  github: null,
  twitter: null,
  linkedin: null,
  ...overrides,
});

const makeArticle = (
  overrides: Partial<{
    title: string;
    slug: string;
    language: DbLang;
    publishDate: string;
    excerpt: string;
    seo: Record<string, unknown>;
    author: ReturnType<typeof makeAuthor>;
  }> = {},
) => ({
  id: 1,
  title: 'Understanding Signals',
  slug: 'understanding-signals',
  content: '<p>content</p>',
  excerpt: 'A deep dive into Angular signals.',
  publishDate: '2025-01-01',
  readingTime: '5 min',
  difficulty: 'intermediate' as const,
  anchors: [],
  otherTranslations: [],
  language: DbLang.English,
  author: makeAuthor(),
  seo: {
    title: 'Understanding Signals | Angular.love',
    description: 'A deep dive into Angular signals.',
    article_published_time: '2025-01-01T10:00:00Z',
    article_modified_time: '2025-02-01T10:00:00Z',
    og_image: [
      {
        url: 'https://angular.love/wp-content/uploads/cover.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
      },
    ],
  },
  ...overrides,
});

describe('buildOrganization', () => {
  const org = buildOrganization({
    baseUrl: BASE_URL,
    siteName: SITE_NAME,
    inLanguage: IN_LANGUAGE,
  });

  it('has correct @type and @id', () => {
    expect(org['@type']).toBe('Organization');
    expect(org['@id']).toBe('https://angular.love/#organization');
  });

  it('sets name and url from context', () => {
    expect(org.name).toBe(SITE_NAME);
    expect(org.url).toBe(BASE_URL);
  });

  it('logo is an ImageObject with a fully-qualified url', () => {
    expect(org.logo['@type']).toBe('ImageObject');
    expect(org.logo.url).toMatch(/^https:\/\//);
  });

  it('sameAs is a non-empty array of https URLs', () => {
    expect(org.sameAs.length).toBeGreaterThan(0);
    org.sameAs.forEach((url) => expect(url).toMatch(/^https:\/\//));
  });
});

describe('buildWebSite', () => {
  const site = buildWebSite({
    baseUrl: BASE_URL,
    siteName: SITE_NAME,
    inLanguage: IN_LANGUAGE,
  });

  it('has correct @type and @id', () => {
    expect(site['@type']).toBe('WebSite');
    expect(site['@id']).toBe('https://angular.love/#website');
  });

  it('declares both supported languages', () => {
    expect(site.inLanguage).toContain('en');
    expect(site.inLanguage).toContain('pl');
  });

  it('references the organization as publisher', () => {
    expect(site.publisher).toEqual({
      '@id': 'https://angular.love/#organization',
    });
  });
});

describe('buildBlogPosting', () => {
  const PAGE_URL = 'https://angular.love/understanding-signals';

  it('uses article.title as headline (matching <h1>)', () => {
    const article = makeArticle();
    const posting = buildBlogPosting(article, {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage: 'en',
    });
    expect(posting.headline).toBe('Understanding Signals');
  });

  it('applies the wp-content URL rewrite to og_image', () => {
    const article = makeArticle();
    const posting = buildBlogPosting(article, {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage: 'en',
    });
    expect(posting.image?.url).toBe(
      'https://wp.angular.love/wp-content/uploads/cover.jpg',
    );
    expect(posting.image?.width).toBe(1200);
    expect(posting.image?.height).toBe(630);
  });

  it('passes ISO dates through unchanged', () => {
    const article = makeArticle();
    const posting = buildBlogPosting(article, {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage: 'en',
    });
    expect(posting.datePublished).toBe('2025-01-01T10:00:00Z');
    expect(posting.dateModified).toBe('2025-02-01T10:00:00Z');
  });

  it.each([
    { inLanguage: 'en', label: 'English article' },
    { inLanguage: 'pl', label: 'Polish article' },
  ])('sets inLanguage for $label', ({ inLanguage }) => {
    const article = makeArticle();
    const posting = buildBlogPosting(article, {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage,
    });
    expect(posting.inLanguage).toBe(inLanguage);
  });

  it('sets localized @id and url from pageUrl', () => {
    const plUrl = 'https://angular.love/pl/understanding-signals';
    const article = makeArticle();
    const posting = buildBlogPosting(article, {
      pageUrl: plUrl,
      baseUrl: BASE_URL,
      inLanguage: 'pl',
    });
    expect(posting['@id']).toBe(`${plUrl}#article`);
    expect(posting.url).toBe(plUrl);
    expect(posting.mainEntityOfPage).toEqual({ '@id': `${plUrl}#webpage` });
  });

  it('points mainEntityOfPage at the WebPage entity, not the bare page URL', () => {
    const posting = buildBlogPosting(makeArticle(), {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage: 'en',
    });
    expect(posting.mainEntityOfPage).toEqual({
      '@id': buildWebPageId(PAGE_URL),
    });
  });

  it('falls back to article.publishDate when Yoast omits the published time', () => {
    const article = makeArticle({
      seo: { article_modified_time: '2026-02-01T10:00:00Z' },
      publishDate: '2026-01-01T08:00:00.000Z',
    });
    const posting = buildBlogPosting(article, {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage: 'en',
    });
    expect(posting.datePublished).toBe('2026-01-01T08:00:00.000Z');
    expect(posting.dateModified).toBe('2026-02-01T10:00:00Z');
  });

  it('prefers the Yoast published time over article.publishDate', () => {
    const article = makeArticle({
      seo: { article_published_time: '2025-01-01T10:00:00Z' },
      publishDate: '2026-01-01T08:00:00.000Z',
    });
    const posting = buildBlogPosting(article, {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage: 'en',
    });
    expect(posting.datePublished).toBe('2025-01-01T10:00:00Z');
  });

  it('references author by @id, not by inline object', () => {
    const article = makeArticle();
    const posting = buildBlogPosting(article, {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage: 'en',
    });
    expect(posting.author).toEqual({
      '@id': 'https://angular.love/author/jane-dev#person',
    });
  });

  it('references publisher as organization @id', () => {
    const article = makeArticle();
    const posting = buildBlogPosting(article, {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage: 'en',
    });
    expect(posting.publisher).toEqual({
      '@id': 'https://angular.love/#organization',
    });
  });

  it('takes description from the excerpt, never from Yoast seo.description', () => {
    const article = makeArticle({
      excerpt: 'What signals actually change about change detection.',
      // The site-wide Yoast default, in the wrong language — must not be used.
      seo: {
        description:
          'Angular.love - ciekawostki oraz rozwiązania dla developerów.',
      },
    });
    const posting = buildBlogPosting(article, {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage: 'en',
    });
    expect(posting.description).toBe(
      'What signals actually change about change detection.',
    );
  });

  it('flattens a rendered-HTML excerpt into the description', () => {
    const article = makeArticle({
      excerpt: '<p>Signals&nbsp;explained &amp; demystified &hellip;</p>\n',
    });
    const posting = buildBlogPosting(article, {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage: 'en',
    });
    expect(posting.description).toBe('Signals explained & demystified …');
  });

  it('omits description when the excerpt is empty', () => {
    const article = makeArticle({
      excerpt: '',
      seo: { description: 'the Yoast default that must not leak in' },
    });
    const posting = buildBlogPosting(article, {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage: 'en',
    });
    expect(posting.description).toBeUndefined();
  });

  it('omits optional fields when seo data is absent', () => {
    const article = makeArticle({
      seo: {},
      excerpt: '',
    });
    const posting = buildBlogPosting(article, {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage: 'en',
    });
    expect(posting.description).toBeUndefined();
    expect(posting.image).toBeUndefined();
    expect(posting.dateModified).toBeUndefined();
    // datePublished still resolves — it falls back to article.publishDate.
    expect(posting.datePublished).toBe('2025-01-01');
  });

  it('omits datePublished only when both seo and publishDate are empty', () => {
    const article = makeArticle({ seo: {}, publishDate: '' });
    const posting = buildBlogPosting(article, {
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      inLanguage: 'en',
    });
    expect(posting.datePublished).toBeUndefined();
  });
});

describe('buildPerson', () => {
  it('generates stable @id from slug', () => {
    const person = buildPerson(makeAuthor(), { baseUrl: BASE_URL });
    expect(person['@id']).toBe(buildPersonId('jane-dev', BASE_URL));
    expect(person['@id']).toBe('https://angular.love/author/jane-dev#person');
  });

  it('sets author page url', () => {
    const person = buildPerson(makeAuthor(), { baseUrl: BASE_URL });
    expect(person.url).toBe('https://angular.love/author/jane-dev');
  });

  it('omits sameAs when no social links are set', () => {
    const person = buildPerson(
      makeAuthor({ github: null, twitter: null, linkedin: null }),
      { baseUrl: BASE_URL },
    );
    expect(person.sameAs).toBeUndefined();
  });

  it('constructs GitHub sameAs URL from handle', () => {
    const person = buildPerson(makeAuthor({ github: 'janedev' }), {
      baseUrl: BASE_URL,
    });
    expect(person.sameAs).toContain('https://github.com/janedev');
  });

  it('constructs X/Twitter sameAs URL and strips leading @', () => {
    const person = buildPerson(makeAuthor({ twitter: '@janedev' }), {
      baseUrl: BASE_URL,
    });
    expect(person.sameAs).toContain('https://x.com/janedev');
  });

  it('includes fully-qualified linkedin URL in sameAs', () => {
    const person = buildPerson(
      makeAuthor({ linkedin: 'https://linkedin.com/in/jane-dev' }),
      { baseUrl: BASE_URL },
    );
    expect(person.sameAs).toContain('https://linkedin.com/in/jane-dev');
  });

  it('skips linkedin when value is not a full URL', () => {
    const person = buildPerson(makeAuthor({ linkedin: 'jane-dev' }), {
      baseUrl: BASE_URL,
    });
    expect((person.sameAs ?? []).some((s) => s.includes('linkedin'))).toBe(
      false,
    );
  });

  it('skips linkedin when the URL is not a LinkedIn host', () => {
    const person = buildPerson(
      makeAuthor({ linkedin: 'https://example.com/profile' }),
      { baseUrl: BASE_URL },
    );
    expect(person.sameAs).toBeUndefined();
  });

  it('accepts www.linkedin.com subdomain URLs', () => {
    const person = buildPerson(
      makeAuthor({ linkedin: 'https://www.linkedin.com/in/jane-dev' }),
      { baseUrl: BASE_URL },
    );
    expect(person.sameAs).toContain('https://www.linkedin.com/in/jane-dev');
  });

  it('includes all three social links when all are provided', () => {
    const person = buildPerson(
      makeAuthor({
        github: 'janedev',
        twitter: 'janedev',
        linkedin: 'https://linkedin.com/in/jane-dev',
      }),
      { baseUrl: BASE_URL },
    );
    expect(person.sameAs).toHaveLength(3);
  });
});

describe('buildBreadcrumbList', () => {
  const breadcrumb = buildBreadcrumbList(
    'https://angular.love/news#breadcrumb',
    [
      { name: 'Home', url: 'https://angular.love/' },
      { name: 'News', url: 'https://angular.love/news' },
    ],
  );

  it('has correct @type', () => {
    expect(breadcrumb['@type']).toBe('BreadcrumbList');
  });

  it('sets @id from the provided id string', () => {
    expect(breadcrumb['@id']).toBe('https://angular.love/news#breadcrumb');
  });

  it('numbers positions starting at 1', () => {
    expect(breadcrumb.itemListElement[0].position).toBe(1);
    expect(breadcrumb.itemListElement[1].position).toBe(2);
  });

  it('preserves item names and URLs', () => {
    expect(breadcrumb.itemListElement[0]).toMatchObject({
      '@type': 'ListItem',
      name: 'Home',
      item: 'https://angular.love/',
    });
    expect(breadcrumb.itemListElement[1]).toMatchObject({
      name: 'News',
      item: 'https://angular.love/news',
    });
  });
});

describe('buildWebPage', () => {
  it.each([
    { type: 'WebPage' as const },
    { type: 'AboutPage' as const },
    { type: 'CollectionPage' as const },
    { type: 'ProfilePage' as const },
  ])('emits correct @type for $type', ({ type }) => {
    const page = buildWebPage(
      type,
      `${BASE_URL}/test#webpage`,
      `${BASE_URL}/test`,
      'Test',
      'en',
      BASE_URL,
    );
    expect(page['@type']).toBe(type);
  });

  it('references the website as isPartOf', () => {
    const page = buildWebPage(
      'AboutPage',
      `${BASE_URL}/about-us#webpage`,
      `${BASE_URL}/about-us`,
      'About Us',
      'en',
      BASE_URL,
    );
    expect(page.isPartOf).toEqual({ '@id': 'https://angular.love/#website' });
  });

  it.each([{ inLanguage: 'en' }, { inLanguage: 'pl' }])(
    'sets inLanguage=$inLanguage',
    ({ inLanguage }) => {
      const page = buildWebPage(
        'WebPage',
        `${BASE_URL}/test#webpage`,
        `${BASE_URL}/test`,
        'Test',
        inLanguage,
        BASE_URL,
      );
      expect(page.inLanguage).toBe(inLanguage);
    },
  );

  it('omits description, mainEntity and about when no options are passed', () => {
    const page = buildWebPage(
      'WebPage',
      `${BASE_URL}/test#webpage`,
      `${BASE_URL}/test`,
      'Test',
      'en',
      BASE_URL,
    );
    expect(page.description).toBeUndefined();
    expect(page.mainEntity).toBeUndefined();
    expect(page.about).toBeUndefined();
  });

  it('emits description and about when provided', () => {
    const page = buildWebPage(
      'WebPage',
      `${BASE_URL}/test#webpage`,
      `${BASE_URL}/test`,
      'Test',
      'en',
      BASE_URL,
      {
        description: 'A page about things',
        about: { '@id': buildOrganizationId(BASE_URL) },
      },
    );
    expect(page.description).toBe('A page about things');
    expect(page.about).toEqual({ '@id': 'https://angular.love/#organization' });
  });

  it('omits an empty description rather than emitting a blank string', () => {
    const page = buildWebPage(
      'WebPage',
      `${BASE_URL}/test#webpage`,
      `${BASE_URL}/test`,
      'Test',
      'en',
      BASE_URL,
      { description: '' },
    );
    expect(page.description).toBeUndefined();
  });
});

describe('serializeJsonLd', () => {
  it('wraps graph in @context + @graph', () => {
    const org = buildOrganization({
      baseUrl: BASE_URL,
      siteName: SITE_NAME,
      inLanguage: IN_LANGUAGE,
    });
    const output = serializeJsonLd([org as SchemaGraphEntity]);
    const parsed = JSON.parse(output);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(Array.isArray(parsed['@graph'])).toBe(true);
  });

  it('escapes < to prevent </script> breakout', () => {
    const evil: SchemaGraphEntity = {
      '@type': 'WebPage',
      '@id': 'https://angular.love/test#webpage',
      url: 'https://angular.love/test',
      name: '</script><script>alert(1)</script>',
      inLanguage: 'en',
      isPartOf: { '@id': 'https://angular.love/#website' },
    };
    const output = serializeJsonLd([evil]);
    expect(output).not.toContain('</script>');
    expect(output).toContain('\\u003c');
  });
});

describe('buildHomeBreadcrumb', () => {
  const crumb = buildHomeBreadcrumb(
    `${BASE_URL}/news#breadcrumb`,
    { name: 'News', url: `${BASE_URL}/news` },
    HOME,
  );

  it('prepends a Home item pointing at baseUrl/', () => {
    expect(crumb.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${BASE_URL}/`,
    });
  });

  it('uses the localized root crumb on a non-default-language page', () => {
    const plCrumb = buildHomeBreadcrumb(
      `${BASE_URL}/pl/artykul#breadcrumb`,
      { name: 'Artykuł', url: `${BASE_URL}/pl/artykul` },
      HOME_PL,
    );
    // Was 'Home' → https://angular.love/ on Polish pages: English label
    // pointing at the English site root.
    expect(plCrumb.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Strona główna',
      item: `${BASE_URL}/pl`,
    });
  });

  it('places the leaf as the second item', () => {
    expect(crumb.itemListElement[1]).toMatchObject({
      position: 2,
      name: 'News',
      item: `${BASE_URL}/news`,
    });
  });
});

describe('Author profile graph (ProfilePage + Person + BreadcrumbList)', () => {
  const PAGE_URL = `${BASE_URL}/author/jane-dev`;
  const makeAuthorFull = (
    overrides: Partial<{
      github: string | null;
      twitter: string | null;
      linkedin: string | null;
    }> = {},
  ) => ({
    slug: 'jane-dev',
    name: 'Jane Dev',
    avatarUrl: 'https://wp.angular.love/avatar.jpg',
    description: { en: 'Angular expert', pl: 'Ekspert Angular' },
    position: 'Developer',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    titles: [] as any[],
    github: null,
    twitter: null,
    linkedin: null,
    ...overrides,
  });

  it('buildPerson accepts Author contract shape (bilingual description)', () => {
    const person = buildPerson(makeAuthorFull(), { baseUrl: BASE_URL });
    expect(person['@id']).toBe(`${BASE_URL}/author/jane-dev#person`);
    expect(person.name).toBe('Jane Dev');
    expect(person.sameAs).toBeUndefined();
  });

  it('profile graph has correct entity types and @ids', () => {
    const author = makeAuthorFull({ github: 'janedev' });
    const profilePage = buildWebPage(
      'ProfilePage',
      `${PAGE_URL}#webpage`,
      PAGE_URL,
      author.name,
      'en',
      BASE_URL,
      { mainEntity: { '@id': `${PAGE_URL}#person` } },
    );
    const person = buildPerson(author, { baseUrl: BASE_URL });
    const breadcrumb = buildHomeBreadcrumb(
      `${PAGE_URL}#breadcrumb`,
      { name: author.name, url: PAGE_URL },
      HOME,
    );
    const graph = [profilePage, person, breadcrumb];

    expect(graph).toHaveLength(3);
    expect(graph[0]['@type']).toBe('ProfilePage');
    expect(graph[1]['@type']).toBe('Person');
    expect(graph[2]['@type']).toBe('BreadcrumbList');
    expect(graph[0]['@id']).toBe(`${PAGE_URL}#webpage`);
    expect(graph[1]['@id']).toBe(`${PAGE_URL}#person`);
    expect(graph[2]['@id']).toBe(`${PAGE_URL}#breadcrumb`);
    expect((profilePage as SchemaWebPage).mainEntity).toEqual({
      '@id': `${PAGE_URL}#person`,
    });
    expect((graph[1] as ReturnType<typeof buildPerson>).sameAs).toContain(
      'https://github.com/janedev',
    );
  });

  it('pl profile page uses /pl/author/:slug URL', () => {
    const plPageUrl = `${BASE_URL}/pl/author/jane-dev`;
    const page = buildWebPage(
      'ProfilePage',
      `${plPageUrl}#webpage`,
      plPageUrl,
      'Jane Dev',
      'pl',
      BASE_URL,
    );
    expect(page['@id']).toBe(`${plPageUrl}#webpage`);
    expect(page.inLanguage).toBe('pl');
    expect(page.url).toBe(plPageUrl);
    expect((page as SchemaWebPage).mainEntity).toBeUndefined();
  });

  it('breadcrumb first item is Home pointing at baseUrl/', () => {
    const breadcrumb = buildHomeBreadcrumb(
      `${PAGE_URL}#breadcrumb`,
      { name: 'Jane Dev', url: PAGE_URL },
      HOME,
    );
    expect(breadcrumb.itemListElement[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${BASE_URL}/`,
    });
    expect(breadcrumb.itemListElement[1]).toMatchObject({
      position: 2,
      name: 'Jane Dev',
      item: PAGE_URL,
    });
  });
});

describe('buildPageGraph', () => {
  it('returns only a WebPage for non-collection types', () => {
    const graph = buildPageGraph({
      jsonLdType: 'AboutPage',
      url: `${BASE_URL}/about-us`,
      baseUrl: BASE_URL,
      name: 'About us',
      inLanguage: 'en',
      home: HOME,
    });
    expect(graph).toHaveLength(1);
    expect(graph[0]).toMatchObject({
      '@type': 'AboutPage',
      '@id': `${BASE_URL}/about-us#webpage`,
      name: 'About us',
    });
    expect((graph[0] as SchemaWebPage).mainEntity).toBeUndefined();
  });

  it('forwards description onto the page entity', () => {
    const graph = buildPageGraph({
      jsonLdType: 'AboutPage',
      url: `${BASE_URL}/about-us`,
      baseUrl: BASE_URL,
      name: 'About us',
      inLanguage: 'en',
      home: HOME,
      description: 'Who we are',
    });
    expect((graph[0] as SchemaWebPage).description).toBe('Who we are');
  });

  it('binds the page to the Organization when aboutOrganization is set', () => {
    const graph = buildPageGraph({
      jsonLdType: 'WebPage',
      url: BASE_URL,
      baseUrl: BASE_URL,
      name: 'Blog and community for Angular fans',
      inLanguage: 'en',
      home: HOME,
      aboutOrganization: true,
    });
    expect((graph[0] as SchemaWebPage).about).toEqual({
      '@id': buildOrganizationId(BASE_URL),
    });
  });

  it('omits about when aboutOrganization is not set', () => {
    const graph = buildPageGraph({
      jsonLdType: 'WebPage',
      url: `${BASE_URL}/become-author`,
      baseUrl: BASE_URL,
      name: 'Become an author',
      inLanguage: 'en',
      home: HOME,
    });
    expect((graph[0] as SchemaWebPage).about).toBeUndefined();
  });

  it('appends a (Home → collection) breadcrumb for CollectionPage', () => {
    const graph = buildPageGraph({
      jsonLdType: 'CollectionPage',
      url: `${BASE_URL}/news`,
      baseUrl: BASE_URL,
      name: 'Angular News',
      inLanguage: 'pl',
      home: HOME,
    });
    expect(graph).toHaveLength(2);
    expect(graph[0]['@type']).toBe('CollectionPage');
    expect(graph[1]).toMatchObject({
      '@type': 'BreadcrumbList',
      '@id': `${BASE_URL}/news#breadcrumb`,
    });
  });

  it('links the CollectionPage to its breadcrumb so it is not orphaned', () => {
    const graph = buildPageGraph({
      jsonLdType: 'CollectionPage',
      url: `${BASE_URL}/news`,
      baseUrl: BASE_URL,
      name: 'Angular News',
      inLanguage: 'pl',
      home: HOME,
    });
    expect((graph[0] as SchemaWebPage).breadcrumb).toEqual({
      '@id': graph[1]['@id'],
    });
  });

  it('omits breadcrumb on page types that emit none', () => {
    const graph = buildPageGraph({
      jsonLdType: 'WebPage',
      url: `${BASE_URL}/writing-rules`,
      baseUrl: BASE_URL,
      name: 'Writing rules',
      inLanguage: 'en',
      home: HOME,
    });
    expect((graph[0] as SchemaWebPage).breadcrumb).toBeUndefined();
  });
});
