import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { NewsletterService } from '../infrastructure/newsletter.service';

type NewsletterState = {
  loading: 'success' | 'error' | 'init' | 'loading';
};

const initialState: NewsletterState = {
  loading: 'init',
};

export const NewsletterStore = signalStore(
  withState(initialState),
  withMethods((store, newsletterService = inject(NewsletterService)) => ({
    resetToInit: () => {
      patchState(store, { loading: 'init' });
    },
    postEmailAddress: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, {
            loading: 'loading',
          });
        }),
        switchMap((email) =>
          newsletterService.postEmailAddress(email).pipe(
            tapResponse({
              next: () => {
                patchState(store, { loading: 'success' });
              },
              error: () => {
                patchState(store, { loading: 'error' });
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
