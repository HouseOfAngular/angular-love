import { Hit, SearchResponse } from '@algolia/client-search';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, from, pipe, switchMap, tap } from 'rxjs';

import { SearchService } from '../infrastructure/search.service';
import { mapToCardModel } from '../models/search-dto-to-card-model.mapper';
import { AlgoliaArticleSearchResultDto } from '../models/search-result.model';

type Filter = {
  query: string;
  page: number;
};

type State = {
  result: SearchResponse<AlgoliaArticleSearchResultDto> | null;
  query: string;
  hits: Hit<AlgoliaArticleSearchResultDto>[];
  page: number;
  filter: {
    query: string;
    page: number;
  };
};

const initialState: State = {
  query: '',
  result: null,
  hits: [],
  page: 0,
  filter: {
    query: '',
    page: 0,
  },
};

export const SearchStore = signalStore(
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
    updatePage: rxMethod<number>(
      tap((page) => {
        patchState(store, { page });
      }),
    ),
    loadByFilter: rxMethod<Filter>(
      pipe(
        distinctUntilChanged(),
        switchMap((filter) =>
          from(searchService.searchArticles(filter.query, filter.page)).pipe(
            tapResponse({
              next: (result) => patchState(store, { result }),
              error: console.error,
            }),
          ),
        ),
      ),
    ),
  })),
  withComputed(({ result, query, page }) => ({
    resultsCount: computed(() => result()?.nbHits || 0),
    searchResultPageItems: computed(
      () => result()?.hits.map(mapToCardModel) || [],
    ),
    hits: computed(() => result()?.hits || []),
    queryParams: computed<Filter>(() => {
      return {
        query: query(),
        page: page(),
      };
    }),
  })),
  withHooks({
    onInit({ loadByFilter, queryParams }) {
      loadByFilter(queryParams);
    },
  }),
);
