import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { filter, map, switchMap } from 'rxjs';

import { SeoMetaData } from '@angular-love/contracts/articles';

import { SEO_CONFIG } from '../tokens';

import { SEO_META_KEYS, SeoMetaKeys } from './seo-meta-keys';
import { SEO_TITLE_KEYS, SeoTitleKeys } from './seo-title-keys';

@Injectable()
export class SeoService {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _title = inject(Title);
  private readonly _meta = inject(Meta);
  private readonly _document = inject(DOCUMENT);
  private readonly _seoConfig = inject(SEO_CONFIG);
  private readonly _translocoService = inject(TranslocoService);
  private _url = '';

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
      });
  }

  setMeta(seoData: SeoMetaData | undefined): void {
    if (!seoData) {
      return;
    }

    if (seoData.robots) {
      const content = Object.values(seoData.robots).join(', ');
      this.updateTag(content, 'robots');
    }

    if (seoData.og_type) {
      this.updateTag(seoData.og_type, 'ogType');
    }

    if (seoData.og_url) {
      this.updateTag(this._url, 'ogURL');
      this.updateTag(this._url, 'twitterURL');
    }

    if (seoData.og_image) {
      this.setMetaImage(
        seoData.og_image.map((i) => {
          const updatedUrl = i.url.startsWith('https://angular.love/wp-content')
            ? i.url.replace(
                'https://angular.love/wp-content',
                'https://wp.angular.love/wp-content',
              )
            : i.url;

          return { url: updatedUrl, height: i.height, width: i.width };
        }),
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
        } else {
          this._meta.removeTag(`name="${key}"`);
          this._meta.removeTag(`itemprop="${key}"`);
          this._meta.removeTag(`property="${key}"`);
        }
      },
    );
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
    return `${_url.origin}${_url.pathname}`;
  }
}
