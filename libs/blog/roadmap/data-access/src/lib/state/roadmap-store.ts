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
import { RoadmapLayer } from '@angular-love/blog/roadmap/ui-roadmap';

import { RoadmapService } from '../infractructure';

import { buildRoadmapLayersFromDto } from './build-roadmap-layers-from-dto';

const roadmapTitleLayer: RoadmapLayer = {
  parentNode: {
    id: 'angular-love',
    title: 'Angular.Love Roadmap Introduction',
    nodeType: 'angular-love',
    description: 'asadasdasd',
    additionalDescription: 'Additional',
    creators: [],
  },
  childNodes: [],
};

type RoadmapState = {
  loading: 'success' | 'error' | 'init' | 'loading';
  nodesDto: RoadmapNodeDTO[];
};

const initialState: RoadmapState = {
  loading: 'init',
  nodesDto: [],
};

export const RoadmapStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    roadmapLayers: computed(() =>
      buildRoadmapLayersFromDto(store.nodesDto() ?? [], roadmapTitleLayer),
    ),
  })),
  withMethods((store, roadmapService = inject(RoadmapService)) => ({
    resetToInit: () => {
      patchState(store, { loading: 'init' });
    },
    getNodes: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            loading: 'loading',
          });
        }),
        switchMap(() =>
          roadmapService.getNodes().pipe(
            tapResponse({
              next: (nodesDto) => {
                patchState(store, {
                  loading: 'success',
                  nodesDto,
                });
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
