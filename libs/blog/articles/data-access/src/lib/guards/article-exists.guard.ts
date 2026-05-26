import { injectResponse } from '@analogjs/router/tokens';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { filter, map, take } from 'rxjs';

import { AlI18nService, AlLocalizeService } from '@angular-love/blog/i18n/util';
import { articleLangToLangMap } from '@angular-love/contracts/articles';

import { ArticleDetailsStore } from '../state/article-details.store';

export const articleExistsGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const i18nService = inject(AlI18nService);
  const localizeService = inject(AlLocalizeService);
  const store = inject(ArticleDetailsStore);
  const response = injectResponse();

  const slug = route.params['articleSlug'] as string;

  store.fetchArticleDetails(slug);

  const validate = (): boolean | UrlTree => {
    const article = store.articleDetails();

    if (!article) {
      if (response) {
        response.statusCode = 404;
      }
      return true;
    }

    const articleLang = articleLangToLangMap[article.language];
    const activeLang = i18nService.getActiveLang();

    if (articleLang !== activeLang) {
      const alternativeSlug = store.alternativeLanguageSlug();
      if (alternativeSlug) {
        return router.createUrlTree(
          localizeService.localizePath(['/', alternativeSlug]),
        );
      }
      if (response) {
        response.statusCode = 404;
      }
      return true;
    }

    return true;
  };

  if (!store.isFetchArticleDetailsLoading()) {
    return validate();
  }

  return toObservable(store.isFetchArticleDetailsLoading).pipe(
    filter((loading) => !loading),
    take(1),
    map(() => validate()),
  );
};
