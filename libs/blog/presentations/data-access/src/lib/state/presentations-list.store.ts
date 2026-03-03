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

import { PresentationsQuery } from '../dto/presentations.query';
import { PresentationsService } from '../infrastructure/presentations.service';

type PresentationsListState = {
  presentations: PresentationPreview[] | null;
  query: PresentationsQuery;
  total: number;
};

const initialState: PresentationsListState = {
  presentations: null,
  query: null,
  total: 0,
};

export const PresentationsListStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withLangState(),
  withCallState('fetch presentations list'),
  withMethods((store) => {
    const presentationsService = inject(PresentationsService);
    return {
      fetchPresentationsList: rxMethod<PresentationsQuery>(
        pipe(
          tap((query) =>
            patchState(store, {
              query: query,
              fetchPresentationsListCallState: LoadingState.LOADING,
            }),
          ),
          concatMap((query) =>
            presentationsService.getPresentationsList({ ...query }).pipe(
              tap({
                next: ({ data, total }) =>
                  patchState(store, {
                    presentations: data,
                    fetchPresentationsListCallState: LoadingState.LOADED,
                    total,
                  }),
                error: (error) =>
                  patchState(store, {
                    fetchPresentationsListCallState: { error },
                  }),
              }),
            ),
          ),
        ),
      ),
    };
  }),
);
