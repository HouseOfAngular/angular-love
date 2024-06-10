import { inject } from '@angular/core';
import { signalStoreFeature, withMethods } from '@ngrx/signals';

import { SeoMetaData } from '@angular-love/contracts/articles';

import { SeoService } from '../services';

export function withSeo() {
  return signalStoreFeature(
    withMethods((_, seoService = inject(SeoService)) => ({
      setMeta(meta: SeoMetaData): void {
        seoService.setMeta(meta);
      },
      setTitle(title: string | undefined): void {
        seoService.setTitle(title);
      },
    })),
  );
}
