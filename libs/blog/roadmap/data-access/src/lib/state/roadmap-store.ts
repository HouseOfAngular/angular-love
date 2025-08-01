import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { RoadmapNodeDTO } from '@angular-love/blog/contracts/roadmap';

import { RoadmapService } from '../infrastructure';
import { buildRoadmapLayersFromDto } from '../utils/build-roadmap-layers-from-dto';
import { getTitleLayer } from '../utils/get-title-layer';

interface RoadmapState {
  loading: 'success' | 'error' | 'init' | 'loading';
  nodesDtos: RoadmapNodeDTO[];
}

const initialState: RoadmapState = {
  loading: 'init',
  nodesDtos: [],
};

export const RoadmapStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    roadmapLayers: computed(() => {
      return buildRoadmapLayersFromDto(
        store.nodesDtos() ?? [],
        getTitleLayer(),
      );
    }),
  })),
  withMethods((store, roadmapService = inject(RoadmapService)) => ({
    getNodes: rxMethod<void>(
      pipe(
        tap(() =>
          patchState(store, {
            loading: 'loading',
          }),
        ),
        switchMap(() =>
          roadmapService.getNodes().pipe(
            tapResponse({
              next: (nodesDtos) =>
                patchState(store, {
                  loading: 'success',
                  nodesDtos,
                }),
              error: () => patchState(store, { loading: 'error' }),
            }),
          ),
        ),
      ),
    ),
  })),
);
