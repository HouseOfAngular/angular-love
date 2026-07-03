import { injectResponse } from '@analogjs/router/tokens';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn } from '@angular/router';
import { filter, map, take } from 'rxjs';

import { AuthorDetailsStore } from '../state/author-details.store';

export const authorExistsGuard: CanActivateFn = (route) => {
  const store = inject(AuthorDetailsStore);
  const response = injectResponse();

  const slug = route.params['authorSlug'] as string;

  store.fetchAuthorDetails(slug);

  const validate = (): boolean => {
    if (!store.authorDetails() && response) {
      response.statusCode = 404;
    }

    return true;
  };

  if (!store.isFetchAuthorDetailsLoading()) {
    return validate();
  }

  return toObservable(store.isFetchAuthorDetailsLoading).pipe(
    filter((loading) => !loading),
    take(1),
    map(() => validate()),
  );
};
