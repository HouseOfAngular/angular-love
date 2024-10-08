import { computed, inject, InjectionToken } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';

import { withLangState } from '@angular-love/blog/i18n/data-access';
import { Article } from '@angular-love/contracts/articles';
import { withSeo } from '@angular-love/seo';
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

export const IsArticlePreview = new InjectionToken<boolean>(
  'Article Details Store Is Article Preview',
  {
    factory: () => false,
  },
);

export const ArticleDetailsStore = signalStore(
  { providedIn: 'root' },
  withSeo(),
  withState(initialState),
  withCallState('fetch article details'),
  withLangState(),
  withMethods(({ ...store }) => {
    const articlesService = inject(ArticlesService);
    const isPreview = inject(IsArticlePreview);

    return {
      fetchArticleDetails: rxMethod<string | undefined>(
        pipe(
          filter((slug): slug is string => !!slug && slug !== store.slug()),
          tap((slug) =>
            patchState(store, {
              slug: slug,
              fetchArticleDetailsCallState: LoadingState.LOADING,
              articleDetails: null,
            }),
          ),
          switchMap((slug) =>
            (isPreview
              ? articlesService.getArticlePreviewBySlug(slug)
              : articlesService.getArticleBySlug(slug)
            ).pipe(
              tapResponse({
                error: (error) =>
                  patchState(store, {
                    slug: slug,
                    fetchArticleDetailsCallState: { error },
                  }),
                next: (articleDetails) => {
                  store.setMeta(articleDetails.seo);
                  store.setTitle(articleDetails.seo.title);
                  return patchState(store, {
                    articleDetails,
                    slug: slug,
                    fetchArticleDetailsCallState: LoadingState.LOADED,
                  });
                },
              }),
            ),
          ),
        ),
      ),
    };
  }),
  withComputed(({ articleDetails, lang }) => ({
    alternativeLanguageSlug: computed(() => {
      return articleDetails()?.otherTranslations.find((t) =>
        t.locale.includes(lang()),
      )?.slug;
    }),
  })),
);
