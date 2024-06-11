import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';

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
);
