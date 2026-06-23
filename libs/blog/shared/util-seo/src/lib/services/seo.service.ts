// libs/blog/shared/util-seo/src/lib/services/seo.service.ts
import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { filter, map, switchMap } from 'rxjs';

import { AlLocalizeService } from '@angular-love/blog/i18n/util';
import { Article, SeoMetaData } from '@angular-love/contracts/articles';

import {
  buildBlogPosting,
  buildBreadcrumbList,
  buildOrganization,
  buildPerson,
  buildWebPage,
  buildWebSite,
  serializeJsonLd,
} from '../json-ld/json-ld.builders';
import {
  isWebPageType,
  SchemaGraphEntity,
  WebPageType,
} from '../json-ld/json-ld.types';
import { rewriteImageUrl } from '../json-ld/url-rewrite';
import { SEO_CONFIG } from '../tokens';

import { SEO_META_KEYS, SeoMetaKeys } from './seo-meta-keys';
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

  init(): void {
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

        // Article routes manage their own meta/title/hreflang/JSON-LD via the
        // store during the awaited guard fetch.  Canonical stays centralised
        // here because it is per-URL and _url is correct at NavigationEnd.
        if (routeData?.['seo'] === false) {
          this.handleCanonicalUrl(this._url);
          return;
        }

        this.removeSeo();

        this.updateTag(seoConfig.locale, 'ogLocale');
        this.setMetaDescription(seoConfig.description);
        this.updateTag(seoConfig.siteName, 'ogSiteName');

        if (routeData && routeData['seo'] && routeData['seo']['title']) {
          this.setTitle(
            `${seoConfig.title} - ${this._translocoService.translate(routeData['seo']['title'])}`,
          );
        } else {
          this.setTitle('');
        }

        this.handleCanonicalUrl(this._url);

        if (routeData && routeData['seo'] && routeData['seo']['autoHrefLang']) {
          this.handleAutoHreflang(seoConfig.baseUrl, this._router.url);
        }

        // JSON-LD: inject for indexable pages; skip for pages with jsonLd:false or no data.seo.
        // Pages with no data.seo (/:articleSlug, /preview/:slug, /newsletter) are handled
        // by stores or intentionally excluded.
        const seoRouteData = routeData?.['seo'];
        const jsonLdFlag = seoRouteData?.['jsonLd'];

        if (seoRouteData !== undefined && jsonLdFlag !== false) {
          const inLanguage = seoConfig.locale.split('_')[0];
          const pageEntities = this._buildStaticPageEntities(
            routeData,
            inLanguage,
          );
          this.setJsonLd(pageEntities);
        }
      });
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
   * Build and inject the full article JSON-LD graph (BlogPosting + Person +
   * BreadcrumbList).  pageUrl and baseUrl are passed explicitly so callers
   * are not gated behind NavigationEnd timing.
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
    const breadcrumb = buildBreadcrumbList(`${pageUrl}#breadcrumb`, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: article.title, url: pageUrl },
    ]);

    this.setJsonLd([blogPosting, person, breadcrumb]);
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

  private _buildStaticPageEntities(
    routeData: Data,
    inLanguage: string,
  ): SchemaGraphEntity[] {
    const jsonLdType = routeData?.['seo']?.['jsonLd'];

    if (!jsonLdType || typeof jsonLdType !== 'string') {
      return []; // base graph only (Organization + WebSite)
    }

    if (!isWebPageType(jsonLdType)) {
      return []; // unknown type, skip
    }

    const pageId = `${this._url}#webpage`;

    if (jsonLdType === 'CollectionPage') {
      const categoryName =
        (routeData['title'] as string | undefined) ?? this._siteName;
      const webPage = buildWebPage(
        'CollectionPage',
        pageId,
        this._url,
        categoryName,
        inLanguage,
        this._baseUrl,
      );
      const breadcrumb = buildBreadcrumbList(`${this._url}#breadcrumb`, [
        { name: 'Home', url: `${this._baseUrl}/` },
        { name: categoryName, url: this._url },
      ]);
      return [webPage, breadcrumb];
    }

    const seoBTitle = routeData?.['seo']?.['title'] as string | undefined;
    const pageName = seoBTitle
      ? this._translocoService.translate(seoBTitle)
      : this._siteName;

    return [
      buildWebPage(
        jsonLdType,
        pageId,
        this._url,
        pageName,
        inLanguage,
        this._baseUrl,
      ),
    ];
  }

  private setMetaTwitterMisc(miscData: object): void {
    const entries = Object.entries(miscData);

    for (const [index, entry] of entries.entries()) {
      const label: MetaDefinition = {
        property: `${SEO_META_KEYS.twitterMiscLabel}${index + 1}`,
        content: entry[0],
      };

      const data: MetaDefinition = {
        property: `${SEO_META_KEYS.twitterMiscData}${index + 1}`,
        content: entry[1],
      };

      this._meta.updateTag(label);
      this._meta.updateTag(data);
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
    const meta: MetaDefinition = {
      property:
        SEO_META_KEYS[name as SeoMetaKeys] ||
        SEO_TITLE_KEYS[name as SeoTitleKeys],
      content: content,
    };

    this._meta.updateTag(meta);
  }

  private removeSeo(): void {
    [...Object.values(SEO_META_KEYS), ...Object.values(SEO_TITLE_KEYS)].forEach(
      (key) => {
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
      },
    );

    this.removeHreflangTags();
    this.removeJsonLd();
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
