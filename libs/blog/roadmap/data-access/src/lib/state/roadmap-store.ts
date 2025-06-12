import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { RoadmapBottomsheetService } from '@angular-love/roadmap-utils';

import { RoadmapService } from '../infractructure/roadmap.service';

type RoadmapState = {
  loading: 'success' | 'error' | 'init' | 'loading';
};

const initialState: RoadmapState = {
  loading: 'init',
};

export const RoadmapStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      roadmapService = inject(RoadmapService),
      bottomsheetService = inject(RoadmapBottomsheetService),
    ) => ({
      resetToInit: () => {
        patchState(store, { loading: 'init' });
      },
      getNodeDetails: rxMethod<string>(
        pipe(
          tap(() => {
            console.log('Store, getNodeDetails');
            patchState(store, {
              loading: 'loading',
            });
            bottomsheetService.close();
          }),
          switchMap((id) =>
            roadmapService.getNodeDetails(id).pipe(
              tapResponse({
                next: (nodeDetails) => {
                  console.log('Success data:', nodeDetails);
                  patchState(store, { loading: 'success' });
                  bottomsheetService.open(nodeDetails);
                },
                error: () => {
                  patchState(store, { loading: 'error' });
                  bottomsheetService.close();
                },
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
