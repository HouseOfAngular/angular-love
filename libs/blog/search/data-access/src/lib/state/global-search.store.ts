import { signalStore, withHooks, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap } from 'rxjs';

import { withSearchFeature } from './search.store-feature';

export const GlobalSearchStore = signalStore(
  withSearchFeature(),
  withMethods(({ search, updateResult, pageSize }) => ({
    search$: rxMethod<string | null>(
      pipe(
        switchMap((query) => {
          if (!query) {
            updateResult(null);
            return EMPTY;
          }
          return search({ query, pageSize: pageSize(), page: 0 });
        }),
      ),
    ),
  })),
  withHooks({
    onInit({ search$, query }) {
      search$(query);
    },
  }),
);
