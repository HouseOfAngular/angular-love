import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ArticlesService } from '../infrastructure/articles.service';
import { Article } from '../contract/article';

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
  // state
  withState(initialState),
  // call states
  withCallState('fetch article details'),
  // methods
  withMethods(({ ...store }) => {
    const articlesService = inject(ArticlesService);
    return {
      fetchArticleDetails: async (data: { slug: string }) => {
        patchState(store, {
          slug: data.slug,
          fetchArticleDetailsCallState: LoadingState.LOADING,
          articleDetails: null,
        });
        try {
          const articleDetails = await firstValueFrom(
            articlesService.getArticleBySlug(data.slug)
          );
          patchState(store, {
            articleDetails,
            slug: data.slug,
            fetchArticleDetailsCallState: LoadingState.LOADED,
          });
        } catch (error) {
          patchState(store, {
            slug: data.slug,
            fetchArticleDetailsCallState: { error },
          });
        }
      },
    };
  })
);
