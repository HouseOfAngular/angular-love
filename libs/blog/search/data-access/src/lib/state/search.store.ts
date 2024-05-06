import { Hit, SearchResponse } from '@algolia/client-search';
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

import { ArticleCardDataModel } from '@angular-love/article-card-data-model';

import { SearchService } from '../infrastructure/search.service';
import { mapToCardModel } from '../models/search-dto-to-card-model.mapper';
import { AlgoliaArticleSearchResultDto } from '../models/search-result.model';

type State = {
  result: SearchResponse<AlgoliaArticleSearchResultDto> | null;
  query: string;
  searchResultPageItems: ArticleCardDataModel[];
  resultsCount: number;
  hits: Hit<AlgoliaArticleSearchResultDto>[];
};

const initialState: State = {
  query: '',
  result: null,
  searchResultPageItems: [],
  resultsCount: 0,
  hits: [],
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
    loadByQuery: rxMethod<string>(
      pipe(
        distinctUntilChanged(),
        tap(() => patchState(store)),
        switchMap((query) =>
          from(searchService.searchArticles(query)).pipe(
            tapResponse({
              next: (result: SearchResponse<AlgoliaArticleSearchResultDto>) =>
                patchState(store, {
                  result: result,
                  searchResultPageItems: result.hits.map(mapToCardModel),
                  resultsCount: result.nbHits,
                  hits: result.hits,
                }),
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
