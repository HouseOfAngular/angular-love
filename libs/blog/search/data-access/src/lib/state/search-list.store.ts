import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, EMPTY, pipe, switchMap } from 'rxjs';

import { withSearchFeature } from './search.store-feature';

export const SearchListStore = signalStore(
  withSearchFeature(),
  withMethods(({ search, pageSize }) => ({
    search$: rxMethod<{ query: string | null; page: number | null }>(
      pipe(
        distinctUntilChanged(),
        switchMap(({ query, page }) => {
          if (query === null || page === null) {
            return EMPTY;
          }
          return search({ query, page, pageSize: pageSize() });
        }),
      ),
    ),
  })),
  withComputed(({ result }) => ({
    resultQuery: computed(() => result()?.query || null),
  })),
);
