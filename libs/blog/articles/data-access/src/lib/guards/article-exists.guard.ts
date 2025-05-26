import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AlI18nService, AlLocalizeService } from '@angular-love/blog/i18n/util';
import { articleLangToLangMap } from '@angular-love/contracts/articles';

import { ArticleDetailsStore } from '../state/article-details.store';

export const articleExistsGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const i18nService = inject(AlI18nService);
  const localizeService = inject(AlLocalizeService);

  const { articleDetails, alternativeLanguageSlug } =
    inject(ArticleDetailsStore);

  const article = articleDetails();
  const alternativeSlug = alternativeLanguageSlug();

  if (
    article &&
    route.url.length > 0 &&
    route.url[0].path === article.slug &&
    articleLangToLangMap[article.language] &&
    articleLangToLangMap[article.language] !== i18nService.getActiveLang() &&
    alternativeSlug
  ) {
    return router.createUrlTree(
      localizeService.localizePath(['/', alternativeSlug]),
      {},
    );
  }

  return true;
};
