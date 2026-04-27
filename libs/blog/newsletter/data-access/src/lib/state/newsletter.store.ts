import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';

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
    postEmailAddress: rxMethod<{ name: string; email: string }>(
      pipe(
        tap(() => {
          patchState(store, {
            loading: 'loading',
          });
        }),
        exhaustMap(({ name, email }) =>
          newsletterService.subscribe(name, email).pipe(
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
