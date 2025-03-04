import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, filter, pipe, switchMap, tap } from 'rxjs';

import { UiAuthorCard } from '@angular-love/blog/authors/ui-author-card';
import { Author } from '@angular-love/blog/contracts/authors';
import { withLangState } from '@angular-love/blog/i18n/data-access';
import { ArticlePreview } from '@angular-love/contracts/articles';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';

import { AuthorService } from '../infrastructure/author.service';

export interface AuthorArticlesQuery {
  take?: number;
  skip?: number;
}

type AuthorDetailsState = {
  authorDetails: Author | null;
  articles: ArticlePreview[] | null;
  articlesQuery: AuthorArticlesQuery | null;
  slug: string | null;
  total: number;
};

const initialState: AuthorDetailsState = {
  authorDetails: null,
  articlesQuery: null,
  articles: null,
  slug: null,
  total: 0,
};

export const AuthorDetailsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCallState('fetch author details'),
  withCallState('fetch author articles'),
  withLangState(),
  withMethods(({ ...store }, authorsService = inject(AuthorService)) => {
    return {
      fetchAuthorDetails: rxMethod<string>(
        pipe(
          filter((slug) => slug !== store.slug()),
          tap((slug) =>
            patchState(store, {
              slug: slug,
              fetchAuthorDetailsCallState: LoadingState.LOADING,
              authorDetails: null,
            }),
          ),
          switchMap((slug) =>
            authorsService.getAuthor(slug).pipe(
              tap({
                next: (authorDetails) =>
                  patchState(store, {
                    authorDetails,
                    slug: slug,
                    fetchAuthorDetailsCallState: LoadingState.LOADED,
                  }),
                error: (error) =>
                  patchState(store, {
                    slug: slug,
                    fetchAuthorDetailsCallState: { error },
                  }),
              }),
            ),
          ),
        ),
      ),
      fetchArticleList: rxMethod<{ slug: string; query: AuthorArticlesQuery }>(
        pipe(
          tap((payload) =>
            patchState(store, {
              articlesQuery: payload.query,
              fetchAuthorArticlesCallState: LoadingState.LOADING,
            }),
          ),
          concatMap((payload) =>
            authorsService
              .getAuthorArticles(payload.slug, { ...payload.query })
              .pipe(
                tap({
                  next: ({ data, total }) => {
                    patchState(store, {
                      articles: data,
                      fetchAuthorArticlesCallState: LoadingState.LOADED,
                      total,
                    });
                  },
                  error: (error) =>
                    patchState(store, {
                      fetchAuthorArticlesCallState: { error },
                    }),
                }),
              ),
          ),
        ),
      ),
    };
  }),
  withComputed(({ authorDetails, lang }) => ({
    author: computed((): UiAuthorCard | null => {
      const author = authorDetails();
      return author
        ? {
            ...author,
            description:
              author.description[lang() as 'pl' | 'en'] ??
              author.description.en,
          }
        : null;
    }),
  })),
);
