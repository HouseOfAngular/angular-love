import { HttpClient } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { catchError, map, of } from 'rxjs';

import { AlLocalizeService } from '@angular-love/blog/i18n/util';

import { PageDetailsStore } from '../state/page-details.store';

export const pageExistGuard: CanMatchFn = (route, segments) => {
  // bypass for local development
  if (isDevMode()) return false;

  const http = inject(HttpClient);
  const router = inject(Router);
  const transloco = inject(TranslocoService);
  const localizeService = inject(AlLocalizeService);

  const { pageDetails, alternativeLanguageSlug } = inject(PageDetailsStore);

  return http
    .get<{
      pages: string[];
    }>(`/assets/root-paths-${transloco.getActiveLang()}.json`)
    .pipe(
      map((data) => {
        const slug = segments[segments.length - 1].path;

        if (slug && data.pages.includes(slug)) {
          return true;
        }

        // check if the page is in the alternative language
        // if the page is in the alternative language, redirect to the alternative language page
        if (
          pageDetails() &&
          pageDetails()!.lang !== transloco.getActiveLang() &&
          alternativeLanguageSlug()
        ) {
          return router.createUrlTree(
            localizeService.localizePath(['/', alternativeLanguageSlug()]),
          );
        }

        return false;
      }),
      catchError((err) => {
        console.error(err);
        return of(false);
      }),
    );
};
