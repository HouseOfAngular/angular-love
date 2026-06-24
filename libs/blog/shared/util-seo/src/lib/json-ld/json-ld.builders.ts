import { Article } from '@angular-love/contracts/articles';

import {
  SchemaBlogPosting,
  SchemaBreadcrumbList,
  SchemaGraphEntity,
  SchemaListItem,
  SchemaOrganization,
  SchemaPerson,
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

export function buildOrganization(ctx: OrgContext): SchemaOrganization {
  return {
    '@type': 'Organization',
    '@id': `${ctx.baseUrl}/#organization`,
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
    publisher: { '@id': `${ctx.baseUrl}/#organization` },
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

  return {
    '@type': 'BlogPosting',
    '@id': `${ctx.pageUrl}#article`,
    // article.title is what renders as <h1>; seo.title is the meta title (may differ)
    headline: article.title,
    ...(article.seo.description
      ? { description: article.seo.description }
      : {}),
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
    ...(article.seo.article_published_time
      ? { datePublished: article.seo.article_published_time }
      : {}),
    ...(article.seo.article_modified_time
      ? { dateModified: article.seo.article_modified_time }
      : {}),
    inLanguage: ctx.inLanguage,
    url: ctx.pageUrl,
    mainEntityOfPage: { '@id': ctx.pageUrl },
    author: { '@id': buildPersonId(article.author.slug, ctx.baseUrl) },
    publisher: { '@id': `${ctx.baseUrl}/#organization` },
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
  if (author.linkedin) {
    // TODO: verify stored format — skipping non-URL values to avoid malformed sameAs
    if (author.linkedin.startsWith('http')) {
      sameAs.push(author.linkedin);
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

export function buildWebPage(
  type: WebPageType,
  pageId: string,
  url: string,
  name: string,
  inLanguage: string,
  baseUrl: string,
): SchemaWebPage {
  return {
    '@type': type,
    '@id': pageId,
    url,
    name,
    inLanguage,
    isPartOf: { '@id': `${baseUrl}/#website` },
  };
}

/** (Home → leaf) breadcrumb shared by article and collection page graphs. */
export function buildHomeBreadcrumb(
  id: string,
  leaf: BreadcrumbItem,
  baseUrl: string,
): SchemaBreadcrumbList {
  return buildBreadcrumbList(id, [{ name: 'Home', url: `${baseUrl}/` }, leaf]);
}

export interface PageGraphContext {
  jsonLdType: WebPageType;
  url: string;
  baseUrl: string;
  name: string;
  inLanguage: string;
}

/**
 * Page-specific entities for a centrally-managed static route. The base
 * Organization + WebSite entities are prepended by `SeoService.setJsonLd`.
 * CollectionPage gets a (Home → collection) breadcrumb; other page types stand
 * alone.
 */
export function buildPageGraph(ctx: PageGraphContext): SchemaGraphEntity[] {
  const pageId = `${ctx.url}#webpage`;
  const webPage = buildWebPage(
    ctx.jsonLdType,
    pageId,
    ctx.url,
    ctx.name,
    ctx.inLanguage,
    ctx.baseUrl,
  );

  if (ctx.jsonLdType === 'CollectionPage') {
    return [
      webPage,
      buildHomeBreadcrumb(
        `${ctx.url}#breadcrumb`,
        { name: ctx.name, url: ctx.url },
        ctx.baseUrl,
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
