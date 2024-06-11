import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';

import { UiAuthorCard } from '@angular-love/blog/authors/types';
import { Author } from '@angular-love/blog/contracts/authors';
import { withLangState } from '@angular-love/blog/i18n/data-access';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';

import { AuthorService } from '../infrastructure/author.service';

type AuthorDetailsState = {
  authorDetails: Author | null;
  slug: string | null;
};

const initialState: AuthorDetailsState = {
  authorDetails: null,
  slug: null,
};

export const AuthorDetailsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCallState('fetch author details'),
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
    };
  }),
  withComputed(({ authorDetails, lang }) => ({
    authorCard: computed((): UiAuthorCard | null => {
      const author = authorDetails();
      return author
        ? {
            ...author,
            description:
              lang() === 'pl'
                ? author.acf.user_description_pl
                : author.acf.user_description_en,
          }
        : null;
    }),
  })),
);
