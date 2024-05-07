import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { Author } from '@angular-love/blog/contracts/authors';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';

import { AuthorService } from '../infrastructure/author.service';

type AuthorDetailsState = {
  authorDetails: Author | null;
  id: string | null;
};

const initialState: AuthorDetailsState = {
  authorDetails: null,
  id: null,
};

export const AuthorDetailsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCallState('fetch author details'),
  withMethods(({ ...store }, authorsService = inject(AuthorService)) => {
    return {
      fetchAuthorDetails: rxMethod<string>(
        pipe(
          tap((id) =>
            patchState(store, {
              id: id,
              fetchAuthorDetailsCallState: LoadingState.LOADING,
              authorDetails: null,
            }),
          ),
          switchMap((id) =>
            authorsService.getAuthor(id).pipe(
              tap({
                next: (authorDetails) =>
                  patchState(store, {
                    authorDetails,
                    id,
                    fetchAuthorDetailsCallState: LoadingState.LOADED,
                  }),
                error: (error) =>
                  patchState(store, {
                    id,
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
