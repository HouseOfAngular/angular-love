import { SearchResponse } from '@algolia/client-search';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, from, pipe, switchMap, tap } from 'rxjs';
import { SearchService } from '../infrastructure/search.service';
import { ArticleSearchResultDto } from '../models/search-result.model';

type State = {
  results: SearchResponse<ArticleSearchResultDto>;
  query: string;
};

const initialState: State = {
  query: '',
  results: {
    hits: [],
    query: '',
    exhaustiveNbHits: false,
    hitsPerPage: 0,
    nbHits: 0,
    nbPages: 0,
    page: 0,
    params: '',
    processingTimeMS: 0,
  },
};

export const SearchStore = signalStore(
  withState(initialState),
  withMethods((store, searchService = inject(SearchService)) => ({
    updateQuery(query: string) {
      patchState(store, { query });
    },
    loadByQuery: rxMethod<string>(
      pipe(
        distinctUntilChanged(),
        tap(() => patchState(store)),
        switchMap((query) =>
          from(searchService.searchArticles(query)).pipe(
            tapResponse({
              next: (results: SearchResponse<ArticleSearchResultDto>) =>
                patchState(store, { results }),
              error: console.error,
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit({ loadByQuery, query }) {
      loadByQuery(query);
    },
  }),
);
