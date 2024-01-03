import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ArticlesService } from '../infrastructure/articles.service';
import { ArticlePreview } from '../contract/article';

type ArticleListState = {
  articles: ArticlePreview[] | null;
  query: string | null;
};

const initialState: ArticleListState = {
  articles: null,
  query: null,
};

export const ArticleListStore = signalStore(
  { providedIn: 'root' },
  // state
  withState(initialState),
  // call states
  withCallState('fetch article list'),
  // methods
  withMethods(({ ...store }) => {
    const articlesService = inject(ArticlesService);
    return {
      fetchArticleList: async (data: { query: string | null }) => {
        patchState(store, {
          query: data.query,
          fetchArticleListCallState: LoadingState.LOADING,
          articles: null,
        });
        try {
          const articles = await firstValueFrom(
            articlesService.getArticleList({ query: data.query })
          );
          patchState(store, {
            articles,
            fetchArticleListCallState: LoadingState.LOADED,
          });
        } catch (error) {
          patchState(store, {
            fetchArticleListCallState: { error },
          });
        }
      },
    };
  })
);
