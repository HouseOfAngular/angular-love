import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { UiAuthorCard } from '@angular-love/blog/authors/types';
import { Author } from '@angular-love/blog/contracts/authors';
import { withLangState } from '@angular-love/blog/i18n/data-access';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';

import { AuthorsQuery } from '../dto/authors.query';
import { AuthorService } from '../infrastructure/author.service';

type AuthorListState = {
  authors: Author[];
  query: AuthorsQuery;
  total: number;
  pageSize: number;
  skip: number;
};

const initialState: AuthorListState = {
  authors: [],
  query: null,
  total: 0,
  pageSize: 6,
  skip: 0,
};

export const AuthorListStore = signalStore(
  withState(initialState),
  withCallState('fetch author list'),
  withLangState(),
  withMethods(({ ...store }, authorsService = inject(AuthorService)) => {
    return {
      fetchAuthorList: rxMethod<AuthorsQuery>(
        pipe(
          tap((query) =>
            patchState(store, {
              query,
              fetchAuthorListCallState: LoadingState.LOADING,
              skip: query?.skip,
            }),
          ),
          switchMap((id) =>
            authorsService.getAuthorsList(id).pipe(
              tap({
                next: ({ data, total }) =>
                  patchState(store, {
                    authors: [...store.authors(), ...data],
                    total,
                    fetchAuthorListCallState: LoadingState.LOADED,
                  }),
                error: (error) =>
                  patchState(store, {
                    fetchAuthorListCallState: { error },
                  }),
              }),
            ),
          ),
        ),
      ),
    };
  }),
  withComputed(({ authors, lang }) => ({
    authorCards: computed((): UiAuthorCard[] =>
      authors().map((author) => ({
        ...author,
        description: author.description[lang() as 'en' | 'pl'],
      })),
    ),
  })),
);
