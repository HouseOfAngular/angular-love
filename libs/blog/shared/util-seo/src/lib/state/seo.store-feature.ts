import { inject } from '@angular/core';
import { signalStoreFeature, withMethods } from '@ngrx/signals';

import { Article, SeoMetaData } from '@angular-love/contracts/articles';

import { HreflangEntry, SeoService } from '../services';

export function withSeo() {
  return signalStoreFeature(
    withMethods((_, seoService = inject(SeoService)) => ({
      setMeta(meta: SeoMetaData, pageUrl?: string): void {
        seoService.setMeta(meta, pageUrl);
      },
      setTitle(title: string | undefined): void {
        seoService.setTitle(title);
      },
      setHreflang(hreflangEntries: HreflangEntry[]): void {
        seoService.setHreflang(hreflangEntries);
      },
      clearHreflang(): void {
        seoService.clearHreflang();
      },
      setArticleJsonLd(
        article: Article,
        inLanguage: string,
        pageUrl: string,
        baseUrl: string,
      ): void {
        seoService.setArticleJsonLd(article, inLanguage, pageUrl, baseUrl);
      },
    })),
  );
}
