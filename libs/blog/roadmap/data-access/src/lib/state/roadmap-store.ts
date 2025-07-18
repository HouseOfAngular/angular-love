import { computed, inject } from '@angular/core';
import {
  translate,
  translateObject,
  TranslocoService,
} from '@jsverse/transloco';
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

function getTitleLayer(): RoadmapLayer {
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
      title: translate('roadmapPage.introductionNode.title'),
      nodeType: 'angular-love',
      description: translate('roadmapPage.introductionNode.description'),
      additionalDescription: {
        introduction: translate(
          'roadmapPage.introductionNode.additionalDescription.introduction',
        ),
        toPrepareList: Object.values(
          translateObject(
            'roadmapPage.introductionNode.additionalDescription.toPrepareList',
          ) ?? {},
        ),
        ending: translate(
          'roadmapPage.introductionNode.additionalDescription.ending',
        ),
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
  withComputed((store) => ({
    roadmapLayers: computed(() => {
      return buildRoadmapLayersFromDto(store.nodesDto() ?? [], getTitleLayer());
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
