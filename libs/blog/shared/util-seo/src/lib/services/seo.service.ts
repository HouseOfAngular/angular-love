import { inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
  private readonly _seoConfig = inject(SEO_CONFIG);

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
      )
      .subscribe((data) => {
        this.removeSeo();

        this.updateTag(this._seoConfig.locale, 'ogLocale');
        this.setMetaDescription(this._seoConfig.description);
        this.updateTag(this._seoConfig.siteName, 'ogSiteName');

        if (data && data['seo'] && data['seo']['title']) {
          this.setTitle(`${data['seo']['title']} - ${this._seoConfig.title}`);
        } else {
          this.setTitle('');
        }
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

    if (seoData.canonical) {
      this.updateTag(seoData.canonical, 'canonical');
    }

    if (seoData.og_url) {
      this.updateTag(seoData.og_url, 'ogURL');
      this.updateTag(seoData.og_url, 'twitterURL');
    }

    if (seoData.og_image) {
      this.setMetaImage(
        seoData.og_image.map((i) => {
          return { url: i.url, height: i.height, width: i.width };
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
        name: `${SEO_META_KEYS.twitterMiscLabel}${index + 1}`,
        content: entry[0],
      };

      const data: MetaDefinition = {
        name: `${SEO_META_KEYS.twitterMiscData}${index + 1}`,
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
      name: name,
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
}
