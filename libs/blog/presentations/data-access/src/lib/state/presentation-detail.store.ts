import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe, tap } from 'rxjs';

import { PresentationPreview } from '@angular-love/blog-contracts/presentations';
import { withLangState } from '@angular-love/blog/i18n/data-access';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';

import { PresentationsService } from '../infrastructure/presentations.service';

type PresentationDetailState = {
  presentation: PresentationPreview | null;
  slug: string | null;
};

const initialState: PresentationDetailState = {
  presentation: null,
  slug: null,
};

export const PresentationDetailStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withLangState(),
  withCallState('fetch presentation detail'),
  withMethods((store) => {
    const presentationsService = inject(PresentationsService);
    return {
      fetchPresentationDetail: rxMethod<string>(
        pipe(
          tap((slug) =>
            patchState(store, {
              slug: slug,
              fetchPresentationDetailCallState: LoadingState.LOADING,
            }),
          ),
          concatMap((slug) =>
            presentationsService.getPresentationDetail(slug).pipe(
              tap({
                next: (data) =>
                  patchState(store, {
                    presentation: data,
                    fetchPresentationDetailCallState: LoadingState.LOADED,
                  }),
                error: (error) =>
                  patchState(store, {
                    fetchPresentationDetailCallState: { error },
                  }),
              }),
            ),
          ),
        ),
      ),
    };
  }),
);
