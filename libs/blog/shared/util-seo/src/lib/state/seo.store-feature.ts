import { inject } from '@angular/core';
import { signalStoreFeature, withMethods } from '@ngrx/signals';

import { Author } from '@angular-love/blog/contracts/authors';
import { Article } from '@angular-love/contracts/articles';

import { SeoService } from '../services';

export function withSeo() {
  return signalStoreFeature(
    withMethods((_, seoService = inject(SeoService)) => ({
      /** Apply the full article SEO layer (meta + title + hreflang + JSON-LD). */
      setArticleSeo(
        article: Article,
        opts: { baseUrl: string; lang: string },
      ): void {
        seoService.setArticleSeo(article, opts);
      },
      /** Apply the full author profile SEO layer (meta + title + hreflang + JSON-LD). */
      setProfileSeo(
        author: Author,
        opts: { baseUrl: string; lang: string },
      ): void {
        seoService.setProfileSeo(author, opts);
      },
      /** Clear page-level seo (e.g. on a failed or in-flight fetch). */
      resetPageSeo(): void {
        seoService.resetPageSeo();
      },
    })),
  );
}
