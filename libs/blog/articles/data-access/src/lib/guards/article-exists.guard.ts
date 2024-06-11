import { HttpClient } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { catchError, map, of } from 'rxjs';

export const articleExistsGuard: CanActivateFn = (route) => {
  // bypass for local development
  if (isDevMode()) return true;

  const http = inject(HttpClient);
  const router = inject(Router);
  const transloco = inject(TranslocoService);

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
        return router.createUrlTree(['not-found']);
      }),
      catchError(() => {
        return of(router.createUrlTree(['not-found']));
      }),
    );
};
