import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, from, pipe, tap } from 'rxjs';

import { SearchService } from '../infrastructure';
import { SearchResponse, SearchResult } from '../models';

type State = {
  query: string | null;
  pageSize: number;
  result: SearchResponse | null;
};

const initialState: State = {
  query: null,
  pageSize: 6,
  result: null,
};

export type SearchPayload = { page?: number; pageSize?: number; query: string };

export function withSearchFeature() {
  return signalStoreFeature(
    withState(initialState),
    withMethods((store, searchService = inject(SearchService)) => ({
      updateQuery: rxMethod<string | null>(
        pipe(
          distinctUntilChanged(),
          tap((query) => {
            if (query !== null) {
              patchState(store, { query });
            }
          }),
        ),
      ),
      updateResult(result: SearchResponse | null): void {
        patchState(store, { result });
      },
      search({ page, pageSize, query }: SearchPayload) {
        return from(
          searchService.search(query, {
            perPage: pageSize,
            page,
          }),
        ).pipe(
          tapResponse({
            next: (result) => patchState(store, { result }),
            error: console.error,
          }),
        );
      },
    })),
    withComputed(({ result }) => ({
      total: computed<number | null>(() => result()?.total || null),
      items: computed<SearchResult[]>(() => result()?.results || []),
    })),
  );
}
