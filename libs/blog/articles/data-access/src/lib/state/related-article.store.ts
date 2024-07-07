import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe, tap } from 'rxjs';

import { withLangState } from '@angular-love/blog/i18n/data-access';
import { ArticlePreview } from '@angular-love/contracts/articles';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';

import { ArticlesService } from '../infrastructure/articles.service';

type ArticleListState = {
  articleId: number | null;
  relatedArticles: ArticlePreview[] | null;
};

const initialState: ArticleListState = {
  articleId: null,
  relatedArticles: null,
};

export const RelatedArticleListStore = signalStore(
  withState(initialState),
  withLangState(),
  withCallState('fetch related article list'),
  withMethods((store) => {
    const articlesService = inject(ArticlesService);
    return {
      fetchArticleList: rxMethod<number>(
        pipe(
          tap((articleId) =>
            patchState(store, {
              articleId,
              fetchRelatedArticleListCallState: LoadingState.LOADING,
            }),
          ),
          concatMap((articleId) =>
            articlesService.getRelatedArticles(articleId).pipe(
              tap({
                next: ({ data }) => {
                  patchState(store, {
                    relatedArticles: data,
                    fetchRelatedArticleListCallState: LoadingState.LOADED,
                  });
                },
                error: (error) =>
                  patchState(store, {
                    fetchRelatedArticleListCallState: { error },
                  }),
              }),
            ),
          ),
        ),
      ),
    };
  }),
);
