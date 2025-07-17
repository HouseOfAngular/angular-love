import { computed, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
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

function getTitleLayer(lang: string): RoadmapLayer {
  const PL_CONFIG = {
    title: 'Angular.Love Roadmap Wprowadzenie',
    description:
      'Mapa drogowa Angulara na Angular.Love to Twoje niezastąpione źródło wiedzy, jeśli chcesz uczyć się Angulara we właściwy sposób. Przedstawia kluczowe koncepcje, dobre praktyki i przydatne materiały w przejrzystej, uporządkowanej formie. Co więcej, zawiera mnóstwo wartościowych zasobów i jest stale aktualizowana, aby nadążać za najnowszymi trendami',
    additionalDescription: {
      introduction:
        'Zanim zagłębisz się w Angulara, warto mieć solidne podstawy w następujących zagadnieniach:',
      toPrepareList: [
        'HTML i CSS – Struktura i stylowanie stron internetowych, w tym Flexbox, Grid i responsywność.',
        'JavaScript (ES6+) – Kluczowe pojęcia, takie jak zmienne, funkcje, promisy oraz async/await.',
        'TypeScript – Typowana wersja JavaScript z interfejsami, generykami i dekoratorami.',
        'Node.js i npm – Uruchamianie JavaScript poza przeglądarką i zarządzanie pakietami.',
        'Git – Zarządzanie wersjami kodu, gałęziami i współpracą zespołową.',
        'API i HTTP – Wysyłanie zapytań i praca z danymi w formacie JSON.',
      ],
      ending:
        'Opanowanie tych zagadnień sprawi, że nauka Angulara będzie znacznie płynniejsza i bardziej efektywna',
    },
  };

  return {
    parentNode: {
      id: 'angular-love',
      title:
        lang !== 'en' ? PL_CONFIG.title : 'Angular.Love Roadmap Introduction',
      nodeType: 'angular-love',
      description:
        lang !== 'en'
          ? PL_CONFIG.description
          : 'The Angular Roadmap on Angular.Love is your go-to guide for learning Angular the right way. It breaks down key concepts, best practices, and useful resources in a clear, structured way. Plus, it’s packed with valuable materials and constantly updated to keep up with the latest trends.',
      additionalDescription:
        lang !== 'en'
          ? PL_CONFIG.additionalDescription
          : {
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
}

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
  withComputed((store, transloco = inject(TranslocoService)) => ({
    roadmapLayers: computed(() => {
      const lang = transloco.getActiveLang();
      console.log('LANG', lang);
      return buildRoadmapLayersFromDto(
        store.nodesDto() ?? [],
        getTitleLayer(lang),
      );
    }),
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
