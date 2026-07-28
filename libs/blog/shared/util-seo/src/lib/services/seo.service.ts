import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { filter, firstValueFrom, map, switchMap } from 'rxjs';

import { Author } from '@angular-love/blog/contracts/authors';
import { AlLocalizeService } from '@angular-love/blog/i18n/util';
import {
  Article,
  articleLocaleToLangMap,
  SeoMetaData,
} from '@angular-love/contracts/articles';

import {
  BreadcrumbItem,
  buildBlogPosting,
  buildBreadcrumbId,
  buildHomeBreadcrumb,
  buildOrganization,
  buildPageGraph,
  buildPerson,
  buildPersonId,
  buildWebPage,
  buildWebPageId,
  buildWebSite,
  normalizeSeoDescription,
  rewriteImageUrl,
  SchemaGraphEntity,
  serializeJsonLd,
} from '../json-ld';
import { SEO_CONFIG, SeoConfig } from '../tokens';

import { interpretRouteSeo, SeoRouteInterpretation } from './route-seo-data';
import {
  isNameScopedMetaTag,
  PAGE_REMOVABLE_META_KEYS,
  SEO_META_KEYS,
  SeoMetaKeys,
} from './seo-meta-keys';
import { SEO_TITLE_KEYS, SeoTitleKeys } from './seo-title-keys';

export interface HreflangEntry {
  locale: string;
  url: string;
}

@Injectable()
export class SeoService {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _title = inject(Title);
  private readonly _meta = inject(Meta);
  private readonly _document = inject(DOCUMENT);
  private readonly _seoConfig = inject(SEO_CONFIG);
  private readonly _translocoService = inject(TranslocoService);
  private readonly _localizeService = inject(AlLocalizeService);
  private _url = '';
  private _baseUrl = '';
  private _siteName = '';

  /**
   * Returns a promise the app initializer awaits, so the cached base config is
   * in place before routing starts.
   */
  init(): Promise<void> {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this._activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        switchMap((route) => route?.data),
        switchMap((routeData) =>
          this._seoConfig.pipe(map((seoConfig) => ({ routeData, seoConfig }))),
        ),
      )
      .subscribe(({ routeData, seoConfig }) => {
        this._url = this.getUrl(seoConfig.baseUrl, this._router.url);
        this._baseUrl = seoConfig.baseUrl;
        this._siteName = seoConfig.siteName;

        // BASE layer: site-wide tags + canonical, applied on EVERY navigation
        // (including store-managed article routes) so og:locale / og:site_name
        // / canonical are always present and deterministic.
        this.applyBaseSeo(seoConfig);
        this.handleCanonicalUrl(this._url);

        const seo = interpretRouteSeo(routeData);

        // Store-managed routes own their PAGE seo (meta/title/hreflang/JSON-LD)
        // and reset it themselves on error. SeoService must not touch the page
        // layer here or it would clobber the tags the store set during the
        // awaited guard fetch (which runs before NavigationEnd).
        if (seo.managedExternally) {
          return;
        }

        // PAGE layer: central, route-data-driven static pages.
        this.resetPageSeo();
        this.setMetaDescription(seoConfig.description);
        this.updateTag('website', 'ogType');

        if (seo.titleKey) {
          this.setTitle(
            `${seoConfig.title} - ${this._translocoService.translate(seo.titleKey)}`,
          );
        } else {
          this.setTitle('');
        }

        if (seo.autoHrefLang) {
          this.handleAutoHreflang(seoConfig.baseUrl, this._router.url);
        }

        if (seo.applyJsonLd) {
          const inLanguage = seoConfig.locale.split('_')[0];
          this.setJsonLd(
            this._buildPageEntities(seo, {
              inLanguage,
              description: seoConfig.description,
            }),
          );
        }
      });

    // Store-managed routes apply their seo (including JSON-LD) during the
    // awaited route guard, which runs BEFORE the first NavigationEnd — so the
    // subscription above has not cached baseUrl/siteName yet. The graph's
    // Organization + WebSite entities are built from those two fields, so
    // without priming them here they serialize with an empty name and url on
    // any direct load of an article or author page. Both values are
    // language-independent, so the first emission is enough.
    return firstValueFrom(this._seoConfig)
      .then(({ baseUrl, siteName }) => {
        this._baseUrl = baseUrl;
        this._siteName = siteName;
      })
      .catch(() => {
        // Never fail app bootstrap over seo config; NavigationEnd still
        // populates these for centrally-managed routes.
      });
  }

  /**
   * Truly site-wide tags applied on EVERY navigation, including store-managed
   * routes. Limited to the keys no page/store ever overrides (og:locale /
   * og:site_name) so it cannot clobber meta a store set before NavigationEnd.
   * Page-level defaults (description, og:type) live on the central-page branch
   * of init(); the store sets its own for article routes.
   */
  private applyBaseSeo(seoConfig: SeoConfig): void {
    this.updateTag(seoConfig.locale, 'ogLocale');
    this.updateTag(seoConfig.siteName, 'ogSiteName');
  }

  setMeta(seoData: SeoMetaData | undefined, pageUrl?: string): void {
    if (!seoData) {
      return;
    }

    if (seoData.description) {
      this.updateTag(seoData.description, 'description');
      this.updateTag(seoData.description, 'ogDescription');
      this.updateTag(seoData.description, 'twitterDescription');
    }

    if (seoData.robots) {
      const content = Object.values(seoData.robots).join(', ');
      this.updateTag(content, 'robots');
    }

    if (seoData.og_type) {
      this.updateTag(seoData.og_type, 'ogType');
    }

    if (seoData.og_url) {
      const url = pageUrl ?? this._url;
      this.updateTag(url, 'ogURL');
      this.updateTag(url, 'twitterURL');
    }

    if (seoData.og_image) {
      this.setMetaImage(
        seoData.og_image.map((i) => ({
          url: rewriteImageUrl(i.url),
          height: i.height,
          width: i.width,
        })),
      );
    }

    if (seoData.article_publisher) {
      this.updateTag(seoData.article_publisher, 'articlePublisher');
    }

    if (seoData.article_published_time) {
      this.updateTag(seoData.article_published_time, 'articlePublishedTime');
    }

    if (seoData.article_modified_time) {
      this.updateTag(seoData.article_modified_time, 'articleModifiedTime');
    }

    if (seoData.twitter_card) {
      this.updateTag(seoData.twitter_card, 'twitterCard');
    }

    if (seoData.twitter_misc) {
      this.setMetaTwitterMisc(seoData.twitter_misc);
    }
  }

  setTitle(title: string | undefined): void {
    if (!title) {
      return;
    }
    this._title.setTitle(title);
    this.updateTag(title, 'ogTitle');
    this.updateTag(title, 'twitterTitle');
    this.updateTag(title, 'name');
  }

  setHreflang(hreflangEntries: HreflangEntry[]): void {
    this.removeHreflangTags();

    for (const entry of hreflangEntries) {
      const fullUrl = entry.url.startsWith('http')
        ? entry.url
        : `${this._baseUrl}${entry.url}`;
      this.appendHreflangLink(entry.locale, fullUrl);
    }

    // TODO: validate if x-default impacts SEO
    // const defaultEntry =
    //   hreflangEntries.find((entry) => entry.locale === 'en') ||
    //   hreflangEntries[0];
    // if (defaultEntry) {
    //   const defaultUrl = defaultEntry.url.startsWith('http')
    //     ? defaultEntry.url
    //     : `${this._baseUrl}${defaultEntry.url}`;
    //   this.appendHreflangLink('x-default', defaultUrl);
    // }
  }

  clearHreflang(): void {
    this.removeHreflangTags();
  }

  /**
   * Serialize and inject a JSON-LD @graph into <head>.
   * Always prepends the global Organization + WebSite entities so callers
   * only pass page-specific entities.
   * Replaces any previously injected script (no stale graphs across navigations).
   */
  setJsonLd(
    pageEntities: SchemaGraphEntity[],
    inLanguage: string[] = ['en', 'pl'],
  ): void {
    const ctx = {
      baseUrl: this._baseUrl,
      siteName: this._siteName,
      inLanguage,
    };
    const graph: SchemaGraphEntity[] = [
      buildOrganization(ctx),
      buildWebSite(ctx),
      ...pageEntities,
    ];
    this._injectJsonLd(graph);
  }

  /**
   * Apply the full article SEO layer (meta + title + hreflang + JSON-LD) with
   * absolute URLs. `baseUrl` and `lang` are passed explicitly so the store can
   * call this during the awaited guard fetch — before NavigationEnd has
   * populated the cached `_url` / `_baseUrl`.
   */
  setArticleSeo(
    article: Article,
    opts: { baseUrl: string; lang: string },
  ): void {
    const { baseUrl, lang } = opts;
    const pageUrl = `${baseUrl}${buildArticlePath(article.slug, lang)}`;

    this.setMeta(
      {
        ...article.seo,
        // Yoast's per-post description is never filled in, so seo.description is
        // the site-wide default (and in the site's language, not the article's).
        // The article's own excerpt is the only per-article summary we have.
        description: normalizeSeoDescription(article.excerpt),
        // Same fallback as the JSON-LD datePublished — see buildBlogPosting.
        article_published_time:
          article.seo.article_published_time || article.publishDate,
      },
      pageUrl,
    );
    this.setTitle(article.seo.title);

    const hreflangEntries = buildArticleHreflangEntries(article, baseUrl);
    if (hreflangEntries) {
      this.setHreflang(hreflangEntries);
    } else {
      this.clearHreflang();
    }

    this.setArticleJsonLd(article, lang, pageUrl, baseUrl);
  }

  /**
   * Build and inject the full article JSON-LD graph (WebPage + BlogPosting +
   * Person + BreadcrumbList).  pageUrl and baseUrl are passed explicitly so
   * callers are not gated behind NavigationEnd timing.
   */
  setArticleJsonLd(
    article: Article,
    inLanguage: string,
    pageUrl: string,
    baseUrl: string,
  ): void {
    const blogPosting = buildBlogPosting(article, {
      pageUrl,
      baseUrl,
      inLanguage,
    });

    const person = buildPerson(article.author, { baseUrl });

    // TODO: Article contract has no category field; breadcrumb is (Home → Article).
    //       Extend Article type with category info to add a middle Category item.
    const breadcrumbId = buildBreadcrumbId(pageUrl);
    const breadcrumb = buildHomeBreadcrumb(
      breadcrumbId,
      { name: article.title, url: pageUrl },
      this._homeCrumb(baseUrl, inLanguage),
    );

    // The page entity the BlogPosting's mainEntityOfPage resolves to, and the
    // owner of the breadcrumb — without it both would be dangling references.
    const webPage = buildWebPage(
      'WebPage',
      buildWebPageId(pageUrl),
      pageUrl,
      article.title,
      inLanguage,
      baseUrl,
      {
        description: normalizeSeoDescription(article.excerpt),
        mainEntity: { '@id': blogPosting['@id'] },
        breadcrumb: { '@id': breadcrumbId },
      },
    );

    this.setJsonLd([webPage, blogPosting, person, breadcrumb]);
  }

  /**
   * Apply the full author profile SEO layer (meta + title + hreflang + JSON-LD).
   * `baseUrl` and `lang` are passed explicitly, consistent with `setArticleSeo`.
   */
  setProfileSeo(author: Author, opts: { baseUrl: string; lang: string }): void {
    const { baseUrl, lang } = opts;
    const pageUrl = `${baseUrl}${buildAuthorPath(author.slug, lang)}`;
    const bio =
      author.description[lang as 'pl' | 'en'] ?? author.description.en;

    this.setTitle(author.name);
    this.setMeta(
      { description: bio, og_type: 'profile', og_url: pageUrl },
      pageUrl,
    );

    const authorBasePath = `/author/${author.slug}`;
    const hreflangEntries = (
      this._translocoService.getAvailableLangs() as string[]
    ).map((l) => ({
      locale: l,
      url: `${baseUrl}${this._localizeService.localizeExplicitPath(authorBasePath, l)}`,
    }));
    this.setHreflang(hreflangEntries);

    const breadcrumbId = buildBreadcrumbId(pageUrl);
    const profilePage = buildWebPage(
      'ProfilePage',
      buildWebPageId(pageUrl),
      pageUrl,
      author.name,
      lang,
      baseUrl,
      {
        mainEntity: { '@id': buildPersonId(author.slug, baseUrl) },
        description: bio,
        breadcrumb: { '@id': breadcrumbId },
      },
    );
    const person = buildPerson(author, { baseUrl });
    const breadcrumb = buildHomeBreadcrumb(
      breadcrumbId,
      { name: author.name, url: pageUrl },
      this._homeCrumb(baseUrl, lang),
    );
    this.setJsonLd([profilePage, person, breadcrumb]);
  }

  removeJsonLd(): void {
    const el = this._document.head.querySelector('script[data-seo-jsonld]');
    if (el) el.remove();
  }

  private _injectJsonLd(graph: SchemaGraphEntity[]): void {
    const serialized = serializeJsonLd(graph);
    const existing = this._document.head.querySelector<HTMLScriptElement>(
      'script[data-seo-jsonld]',
    );
    const script = existing ?? this._document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo-jsonld', '');
    script.textContent = serialized;
    if (!existing) {
      this._document.head.appendChild(script);
    }
  }

  /**
   * Page-specific JSON-LD entities for a centrally-managed static route.
   * Returns [] (base Organization + WebSite graph only) when no valid page type
   * is declared (e.g. the roadmap route).
   */
  private _buildPageEntities(
    seo: SeoRouteInterpretation,
    ctx: { inLanguage: string; description: string },
  ): SchemaGraphEntity[] {
    if (!seo.jsonLdType) {
      return [];
    }

    return buildPageGraph({
      jsonLdType: seo.jsonLdType,
      url: this._url,
      baseUrl: this._baseUrl,
      name: this._resolvePageName(seo),
      inLanguage: ctx.inLanguage,
      // Mirrors the meta description applied for this page above.
      description: ctx.description,
      aboutOrganization: seo.aboutOrganization,
      home: this._homeCrumb(this._baseUrl, ctx.inLanguage),
    });
  }

  /**
   * Root breadcrumb crumb for the given language. `localizeExplicitPath` is the
   * same helper that builds hreflang, so the url matches that language's
   * homepage canonical exactly ('/' for en, '/pl' for pl).
   */
  private _homeCrumb(baseUrl: string, lang: string): BreadcrumbItem {
    return {
      // Translated in `lang` explicitly rather than the active language: this
      // runs during the route guard, where the two can still differ.
      name: this._translocoService.translate('seo.breadcrumbHome', {}, lang),
      url: `${baseUrl}${this._localizeService.localizeExplicitPath('/', lang)}`,
    };
  }

  private _resolvePageName(seo: SeoRouteInterpretation): string {
    if (seo.jsonLdType === 'CollectionPage') {
      return seo.collectionTitle ?? this._siteName;
    }
    return seo.titleKey
      ? this._translocoService.translate(seo.titleKey)
      : this._siteName;
  }

  private setMetaTwitterMisc(miscData: object): void {
    const entries = Object.entries(miscData);

    for (const [index, entry] of entries.entries()) {
      this._meta.updateTag(
        buildMetaDefinition(
          `${SEO_META_KEYS.twitterMiscLabel}${index + 1}`,
          entry[0],
        ),
      );
      this._meta.updateTag(
        buildMetaDefinition(
          `${SEO_META_KEYS.twitterMiscData}${index + 1}`,
          entry[1],
        ),
      );
    }
  }

  private setMetaDescription(metaDescription: string): void {
    this._meta.removeTag('itemprop="description"'); // Because if we not remove the tag it will not be updated.

    const keys: SeoMetaKeys[] = [
      'description',
      'ogDescription',
      'twitterDescription',
    ];

    for (const key of keys) {
      this.updateTag(metaDescription, key);
    }
  }

  private setMetaImage(
    images: {
      url: string;
      width: number;
      height: number;
    }[],
  ): void {
    for (const image of images) {
      this._meta.removeTag('itemprop="image"'); // Because if we not remove the tag it will not be updated.

      this.updateTag(image.url, 'ogImage');
      this.updateTag(image.url, 'twitterImage');
      this.updateTag(image.url, 'image');
      this.updateTag(`${image.width}`, 'ogImageWidth');
      this.updateTag(`${image.height}`, 'ogImageHeight');
    }
  }

  private updateTag(content: string, name: SeoMetaKeys | SeoTitleKeys): void {
    const tag =
      SEO_META_KEYS[name as SeoMetaKeys] ||
      SEO_TITLE_KEYS[name as SeoTitleKeys];

    this._meta.updateTag(buildMetaDefinition(tag, content));
  }

  /**
   * Clear all PAGE-level seo (title, description trio, og:type, images, urls,
   * article:*, robots, twitter card/misc, hreflang, JSON-LD) before a new
   * page's seo is applied, and reset the document title to the site name. Only
   * the BASE layer (og:locale / og:site_name) is left untouched — see
   * seo-meta-keys partition.
   */
  resetPageSeo(): void {
    const pageMetaValues = PAGE_REMOVABLE_META_KEYS.map(
      (key) => SEO_META_KEYS[key],
    );

    [...pageMetaValues, ...Object.values(SEO_TITLE_KEYS)].forEach((key) => {
      if (
        key === SEO_META_KEYS.twitterMiscData ||
        key === SEO_META_KEYS.twitterMiscLabel
      ) {
        // twitter:data1, twitter:data2, twitter:label1 and twitter:label2 hack
        this._meta.removeTag(`name="${key}1"`);
        this._meta.removeTag(`name="${key}2"`);
        this._meta.removeTag(`property="${key}1"`);
        this._meta.removeTag(`property="${key}2"`);
      } else {
        this._meta.removeTag(`name="${key}"`);
        this._meta.removeTag(`itemprop="${key}"`);
        this._meta.removeTag(`property="${key}"`);
      }
    });

    this.removeHreflangTags();
    this.removeJsonLd();
    // The title meta tags are removed above, but Title.setTitle isn't covered by
    // Meta — reset the document <title> too so it can't stay stuck on the
    // previous page (e.g. after a store fetch error or on an untitled route).
    this._title.setTitle(this._siteName);
  }

  private handleAutoHreflang(baseUrl: string, currentPath: string): void {
    const availableLanguages =
      this._translocoService.getAvailableLangs() as string[];
    const hreflangEntries: HreflangEntry[] = [];

    for (const lang of availableLanguages) {
      const localizedPath = this._localizeService.localizeExplicitPath(
        currentPath,
        lang,
      );
      const fullUrl = `${baseUrl}${localizedPath}`;

      hreflangEntries.push({
        locale: lang,
        url: fullUrl,
      });
    }

    this.setHreflang(hreflangEntries);
  }

  private appendHreflangLink(hreflang: string, href: string): void {
    const link = this._document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', hreflang);
    link.setAttribute('href', href);
    this._document.head.appendChild(link);
  }

  private removeHreflangTags(): void {
    const hreflangLinks = this._document.head.querySelectorAll(
      'link[rel="alternate"][hreflang]',
    );
    hreflangLinks.forEach((link) => link.remove());
  }

  private handleCanonicalUrl(url: string): void {
    if (this.canonicalLinkExists) {
      this.updateCanonicalLink(url);
    } else {
      this.appendCanonicalLink(url);
    }
  }

  private get canonicalLinkExists(): boolean {
    const links = this._document.head.querySelectorAll('link[rel="canonical"]');
    return !!links.length;
  }

  private appendCanonicalLink(url: string): void {
    const link = this._document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    this._document.head.appendChild(link);
  }

  private updateCanonicalLink(url: string): void {
    const link = this._document.head.querySelector('link[rel="canonical"]');
    if (link) {
      link.setAttribute('href', url);
    }
  }

  private getUrl(origin: string, path: string): string {
    const _url = new URL(`${origin}${path}`);
    const pathname = _url.pathname.replace(/\/$/, '');
    return `${_url.origin}${pathname}`;
  }
}

/**
 * Put the tag in the attribute its spec actually defines. Angular's `Meta`
 * derives its lookup selector from whichever of `name`/`property` is set, so
 * this also keeps updates and removals matching the tag that was written.
 */
export function buildMetaDefinition(
  tag: string,
  content: string,
): MetaDefinition {
  return isNameScopedMetaTag(tag)
    ? { name: tag, content }
    : { property: tag, content };
}

export function buildArticlePath(slug: string, langCode: string): string {
  return langCode === 'en' ? `/${slug}` : `/${langCode}/${slug}`;
}

export function buildAuthorPath(slug: string, langCode: string): string {
  return langCode === 'en' ? `/author/${slug}` : `/${langCode}/author/${slug}`;
}

export function buildArticleHreflangEntries(
  article: Article,
  baseUrl: string,
): HreflangEntry[] | null {
  if (!article.otherTranslations || article.otherTranslations.length < 2) {
    return null;
  }

  return article.otherTranslations.map((translation) => {
    const langCode = articleLocaleToLangMap[translation.locale];
    const path = buildArticlePath(translation.slug, langCode);

    return {
      locale: langCode,
      url: `${baseUrl}${path}`,
    } satisfies HreflangEntry;
  });
}
