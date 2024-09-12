import { HttpClient } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { catchError, map, of } from 'rxjs';

import { AlLocalizeService } from '@angular-love/blog/i18n/util';

import { PageDetailsStore } from '../state/page-details.store';

export const pageExistGuard: CanActivateFn = (route) => {
  // bypass for local development
  if (isDevMode()) return true;

  const http = inject(HttpClient);
  const router = inject(Router);
  const transloco = inject(TranslocoService);
  const localizeService = inject(AlLocalizeService);

  const { pageDetails, alternativeLanguageSlug } = inject(PageDetailsStore);

  const notFoundPageUrlTree = router.createUrlTree(
    localizeService.localizePath(['/', '404']),
  );

  return http
    .get<{
      pages: string[];
    }>(`/assets/root-paths-${transloco.getActiveLang()}.json`)
    .pipe(
      map((data) => {
        const slug = route.paramMap.get('slug');

        if (slug && data.pages.includes(slug)) {
          return true;
        }

        // check if the page is in the alternative language
        if (pageDetails()?.lang !== transloco.getActiveLang()) {
          // if the page is in the alternative language, redirect to the alternative language page
          if (alternativeLanguageSlug()) {
            return router.createUrlTree(
              localizeService.localizePath([
                'pages/',
                alternativeLanguageSlug(),
              ]),
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
