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
    description:
      'The Angular Roadmap on Angular.Love is your go-to guide for learning Angular the right way. It breaks down key concepts, best practices, and useful resources in a clear, structured way. Plus, it’s packed with valuable materials and constantly updated to keep up with the latest trends.',
    additionalDescription: {
      introduction:
        "Before diving into Angular, it's essential to have a solid understanding of the following concepts:",
      toPrepareList: [
        'HTML & CSS – Structure and styling of web pages, including Flexbox, Grid, and responsiveness.',
        'JavaScript (ES6+) – Core concepts like variables, functions, promises, and async/await.',
        'TypeScript – A typed version of JavaScript with interfaces, generics, and decorators.',
        'Node.js & npm – Running JavaScript outside the browser and managing packages.',
        'Git – Handling code versions, branches, and teamwork.',
        'APIs & HTTP – Making requests and working with JSON data.',
      ],
      ending:
        'Having a grasp of these topics will make your Angular learning journey much smoother and more effective.',
    },
    creators: [
      { name: 'Miłosz Rutkowski', slug: 'milosz-rutkowski' },
      { name: 'Damian Brzeziński', slug: 'damian-brzezinski' },
      { name: 'Łukasz Myszkowski', slug: 'lukaszm' },
      { name: 'Dominik Kalinowski', slug: 'dominik-kalinowski' },
      { name: 'Dawid Gruszczyński', slug: 'dawid-gruszczynski' },
    ],
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
