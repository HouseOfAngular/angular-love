import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ArticlePreview } from '../infrastructure/article';
import { ArticlesService } from '../infrastructure/articles.service';

type ArticleListState = {
  articles: ArticlePreview[] | null;
  query: string | null;
};

export const ArticleListSignalStore = signalStore(
  { providedIn: 'root' },
  // state
  withState<ArticleListState>({ articles: null, query: null }),
  // call states
  withCallState<unknown>('fetch article list'),
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

const articleListSignalStore = new ArticleListSignalStore();
articleListSignalStore.isFetchArticleListInit();
