import { Article } from '@angular-love/contracts/articles';

import { normalizeSeoDescription } from './description';
import {
  SchemaBlogPosting,
  SchemaBreadcrumbList,
  SchemaGraphEntity,
  SchemaListItem,
  SchemaOrganization,
  SchemaPerson,
  SchemaRef,
  SchemaWebPage,
  SchemaWebSite,
  WebPageType,
} from './json-ld.types';
import { rewriteImageUrl } from './url-rewrite';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface OrgContext {
  baseUrl: string;
  siteName: string;
  inLanguage: string[];
}

export interface BlogPostingContext {
  pageUrl: string;
  baseUrl: string;
  inLanguage: string;
}

export function buildOrganizationId(baseUrl: string): string {
  return `${baseUrl}/#organization`;
}

export function buildOrganization(ctx: OrgContext): SchemaOrganization {
  return {
    '@type': 'Organization',
    '@id': buildOrganizationId(ctx.baseUrl),
    name: ctx.siteName,
    url: ctx.baseUrl,
    logo: {
      '@type': 'ImageObject',
      // TODO: confirm the actual logo asset path used in production
      url: `${ctx.baseUrl}/assets/images/angular-love-logo.png`,
    },
    sameAs: [
      // TODO: verify all social profile URLs below before going live
      'https://github.com/angular-love',
      'https://x.com/angular_love',
      'https://www.linkedin.com/company/angular-love',
      'https://www.youtube.com/@angularlove',
    ],
  };
}

export function buildWebSite(ctx: OrgContext): SchemaWebSite {
  return {
    '@type': 'WebSite',
    '@id': `${ctx.baseUrl}/#website`,
    url: `${ctx.baseUrl}/`,
    name: ctx.siteName,
    inLanguage: ctx.inLanguage,
    publisher: { '@id': buildOrganizationId(ctx.baseUrl) },
    // TODO: verify the query param name used on the /search page (currently assuming ?q=)
    potentialAction: {
      '@type': 'SearchAction',
      target: `${ctx.baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildBlogPosting(
  article: Article,
  ctx: BlogPostingContext,
): SchemaBlogPosting {
  const firstImage = article.seo.og_image?.[0];
  // Yoast's article_published_time is absent from a lot of synced seo payloads;
  // article.publishDate always carries the date, so fall back to it rather than
  // emit a BlogPosting with only a dateModified.
  const datePublished =
    article.seo.article_published_time || article.publishDate;
  // NOT seo.description — Yoast holds only the site-wide default there.
  const description = normalizeSeoDescription(article.excerpt);

  return {
    '@type': 'BlogPosting',
    '@id': `${ctx.pageUrl}#article`,
    // article.title is what renders as <h1>; seo.title is the meta title (may differ)
    headline: article.title,
    ...(description ? { description } : {}),
    ...(firstImage
      ? {
          image: {
            '@type': 'ImageObject' as const,
            url: rewriteImageUrl(firstImage.url),
            width: firstImage.width,
            height: firstImage.height,
          },
        }
      : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(article.seo.article_modified_time
      ? { dateModified: article.seo.article_modified_time }
      : {}),
    inLanguage: ctx.inLanguage,
    url: ctx.pageUrl,
    mainEntityOfPage: { '@id': buildWebPageId(ctx.pageUrl) },
    author: { '@id': buildPersonId(article.author.slug, ctx.baseUrl) },
    publisher: { '@id': buildOrganizationId(ctx.baseUrl) },
  };
}

export function buildPersonId(authorSlug: string, baseUrl: string): string {
  return `${baseUrl}/author/${authorSlug}#person`;
}

export interface PersonAuthorInput {
  slug: string;
  name: string;
  github: string | null;
  twitter: string | null;
  linkedin: string | null;
}

export function buildPerson(
  author: PersonAuthorInput,
  ctx: { baseUrl: string },
): SchemaPerson {
  const sameAs: string[] = [];

  if (author.github) {
    sameAs.push(`https://github.com/${author.github}`);
  }
  if (author.twitter) {
    // Strip a leading @ if the value was stored with it
    const handle = author.twitter.replace(/^@/, '');
    sameAs.push(`https://x.com/${handle}`);
  }
  if (author.linkedin?.startsWith('http')) {
    // Only emit genuine LinkedIn URLs in the LinkedIn sameAs slot
    try {
      const { hostname } = new URL(author.linkedin);
      if (hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com')) {
        sameAs.push(author.linkedin);
      }
    } catch {
      // ignore malformed URL
    }
  }

  return {
    '@type': 'Person',
    '@id': buildPersonId(author.slug, ctx.baseUrl),
    name: author.name,
    url: `${ctx.baseUrl}/author/${author.slug}`,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function buildBreadcrumbList(
  id: string,
  items: BreadcrumbItem[],
): SchemaBreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    '@id': id,
    itemListElement: items.map(
      (item, index): SchemaListItem => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      }),
    ),
  };
}

export interface WebPageOptions {
  /** The page's primary content entity (e.g. the Person on a ProfilePage). */
  mainEntity?: SchemaRef;
  /** The entity the page is about (e.g. the Organization on the homepage). */
  about?: SchemaRef;
  /** Should match the page's meta description. */
  description?: string;
  /** The page's BreadcrumbList, which is otherwise orphaned in the graph. */
  breadcrumb?: SchemaRef;
}

export function buildWebPage(
  type: WebPageType,
  pageId: string,
  url: string,
  name: string,
  inLanguage: string,
  baseUrl: string,
  opts: WebPageOptions = {},
): SchemaWebPage {
  return {
    '@type': type,
    '@id': pageId,
    url,
    name,
    ...(opts.description ? { description: opts.description } : {}),
    inLanguage,
    isPartOf: { '@id': `${baseUrl}/#website` },
    ...(opts.mainEntity ? { mainEntity: opts.mainEntity } : {}),
    ...(opts.about ? { about: opts.about } : {}),
    ...(opts.breadcrumb ? { breadcrumb: opts.breadcrumb } : {}),
  };
}

/** `@id` of the WebPage entity for a page, and the `mainEntityOfPage` target. */
export function buildWebPageId(pageUrl: string): string {
  return `${pageUrl}#webpage`;
}

/** `@id` of a page's BreadcrumbList entity. */
export function buildBreadcrumbId(pageUrl: string): string {
  return `${pageUrl}#breadcrumb`;
}

/**
 * (Home → leaf) breadcrumb shared by article and collection page graphs.
 *
 * `home` is passed in rather than derived from baseUrl: on a Polish page the
 * crumb must be the Polish label pointing at the Polish home, not "Home"
 * pointing at the English site root.
 */
export function buildHomeBreadcrumb(
  id: string,
  leaf: BreadcrumbItem,
  home: BreadcrumbItem,
): SchemaBreadcrumbList {
  return buildBreadcrumbList(id, [home, leaf]);
}

export interface PageGraphContext {
  jsonLdType: WebPageType;
  url: string;
  baseUrl: string;
  name: string;
  inLanguage: string;
  /** Should match the page's meta description. */
  description?: string;
  /** Bind the page to the Organization entity via `about` (homepage). */
  aboutOrganization?: boolean;
  /** Localized (label + url) root crumb; used by CollectionPage. */
  home: BreadcrumbItem;
}

/**
 * Page-specific entities for a centrally-managed static route. The base
 * Organization + WebSite entities are prepended by `SeoService.setJsonLd`.
 * CollectionPage gets a (Home → collection) breadcrumb; other page types stand
 * alone.
 */
export function buildPageGraph(ctx: PageGraphContext): SchemaGraphEntity[] {
  const isCollection = ctx.jsonLdType === 'CollectionPage';
  const breadcrumbId = buildBreadcrumbId(ctx.url);
  const webPage = buildWebPage(
    ctx.jsonLdType,
    buildWebPageId(ctx.url),
    ctx.url,
    ctx.name,
    ctx.inLanguage,
    ctx.baseUrl,
    {
      description: ctx.description,
      ...(ctx.aboutOrganization
        ? { about: { '@id': buildOrganizationId(ctx.baseUrl) } }
        : {}),
      ...(isCollection ? { breadcrumb: { '@id': breadcrumbId } } : {}),
    },
  );

  if (isCollection) {
    return [
      webPage,
      buildHomeBreadcrumb(
        breadcrumbId,
        { name: ctx.name, url: ctx.url },
        ctx.home,
      ),
    ];
  }

  return [webPage];
}

export function serializeJsonLd(graph: SchemaGraphEntity[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
    // Escape '<' to prevent </script> injection breakout in HTML
  }).replace(/</g, '\\u003c');
}
