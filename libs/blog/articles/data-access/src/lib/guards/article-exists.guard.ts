import { HttpClient } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { LocalizeRouterService } from '@penleychan/ngx-transloco-router';
import { catchError, map, of } from 'rxjs';

import { ArticleDetailsStore } from '../state/article-details.store';

export const articleExistsGuard: CanActivateFn = (route) => {
  // bypass for local development
  if (isDevMode()) return true;

  const http = inject(HttpClient);
  const router = inject(Router);
  const transloco = inject(TranslocoService);
  const { articleDetails, alternativeLanguageSlug } =
    inject(ArticleDetailsStore);
  const localizeRouterService = inject(LocalizeRouterService);

  const notFoundPageUrlTree = router.createUrlTree(
    localizeRouterService.translateRoute(['/', 'not-found']) as string[],
  );
  const homepageUrlTree = router.createUrlTree(
    localizeRouterService.translateRoute(['/']) as string[],
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
            const route = localizeRouterService.translateRoute([
              '/',
              alternativeLanguageSlug(),
            ]) as string[];
            return router.createUrlTree(route, {});
          } else {
            return homepageUrlTree;
          }
        }

        return notFoundPageUrlTree;
      }),
      catchError(() => {
        return of(notFoundPageUrlTree);
      }),
    );
};
