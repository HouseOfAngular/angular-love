import { HttpClient } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { catchError, map, of } from 'rxjs';

import { AlLocalizeService } from '@angular-love/blog/i18n/util';

import { ArticleDetailsStore } from '../state/article-details.store';

export const articleExistsGuard: CanActivateFn = (route) => {
  // bypass for local development
  if (isDevMode()) return true;

  const http = inject(HttpClient);
  const router = inject(Router);
  const transloco = inject(TranslocoService);
  const localizeService = inject(AlLocalizeService);

  const { articleDetails, alternativeLanguageSlug } =
    inject(ArticleDetailsStore);

  const notFoundPageUrlTree = router.createUrlTree(
    localizeService.localizePath(['/', '404']),
  );

  return http
    .get<{
      articles: string[];
    }>(`/assets/root-paths-${transloco.getActiveLang()}.json`)
    .pipe(
      map((data) => {
        const slug = route.paramMap.get('articleSlug');

        if (slug && data.articles.includes(slug)) {
          return true;
        }

        // check if the article is in the alternative language
        if (articleDetails()?.lang !== transloco.getActiveLang()) {
          // if the article is in the alternative language, redirect to the alternative language page
          if (alternativeLanguageSlug()) {
            return router.createUrlTree(
              localizeService.localizePath(['/', alternativeLanguageSlug()]),
              {},
            );
          } else {
            return notFoundPageUrlTree;
          }
        }

        return notFoundPageUrlTree;
      }),
      catchError(() => {
        return of(notFoundPageUrlTree);
      }),
    );
};
