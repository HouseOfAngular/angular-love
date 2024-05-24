import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { Article } from '@angular-love/contracts/articles';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';

import { ArticlesService } from '../infrastructure/articles.service';

type ArticleDetailsState = {
  articleDetails: Article | null;
  slug: string | null;
};

const initialState: ArticleDetailsState = {
  articleDetails: null,
  slug: null,
};

export const ArticleDetailsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCallState('fetch article details'),
  withMethods(({ ...store }) => {
    const articlesService = inject(ArticlesService);
    return {
      fetchArticleDetails: rxMethod<string>(
        pipe(
          tap((slug) =>
            patchState(store, {
              slug: slug,
              fetchArticleDetailsCallState: LoadingState.LOADING,
              articleDetails: null,
            }),
          ),
          switchMap((slug) =>
            articlesService.getArticleBySlug(slug).pipe(
              tapResponse({
                error: (error) =>
                  patchState(store, {
                    slug: slug,
                    fetchArticleDetailsCallState: { error },
                  }),
                next: (articleDetails) =>
                  patchState(store, {
                    articleDetails,
                    slug: slug,
                    fetchArticleDetailsCallState: LoadingState.LOADED,
                  }),
              }),
            ),
          ),
        ),
      ),
    };
  }),
);
