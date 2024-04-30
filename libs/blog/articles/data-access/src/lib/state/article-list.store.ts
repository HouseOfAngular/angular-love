import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { ArticlePreview } from '@angular-love/contracts/articles';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';

import { ArticlesQuery } from '../dto/articles.query';
import { ArticlesService } from '../infrastructure/articles.service';

type ArticleListState = {
  articles: ArticlePreview[] | null;
  query: ArticlesQuery;
  total: number;
};

const initialState: ArticleListState = {
  articles: null,
  query: null,
  total: 0,
};

export const ArticleListStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCallState('fetch article list'),
  withMethods(({ ...store }) => {
    const articlesService = inject(ArticlesService);
    return {
      fetchArticleList: rxMethod<ArticlesQuery>(
        pipe(
          tap((query) =>
            patchState(store, {
              query: query,
              fetchArticleListCallState: LoadingState.LOADING,
              articles: null,
            }),
          ),

          switchMap((query) =>
            articlesService.getArticleList({ ...query }).pipe(
              tap({
                next: ({ data, total }) => {
                  patchState(store, {
                    articles: data,
                    fetchArticleListCallState: LoadingState.LOADED,
                    total,
                  });
                },
                error: (error) =>
                  patchState(store, {
                    fetchArticleListCallState: { error },
                  }),
              }),
            ),
          ),
        ),
      ),
    };
  }),
);
