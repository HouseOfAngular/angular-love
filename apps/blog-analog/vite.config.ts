/// <reference types="vitest" />

import { resolve } from 'path';
import analog from '@analogjs/platform';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    cacheDir: `../../node_modules/.vite`,
    build: {
      outDir: '../../dist/apps/blog-analog/client',
      reportCompressedSize: true,
      target: ['es2020'],
    },
    server: {
      fs: {
        allow: ['.'],
      },
    },
    resolve: {
      alias: {
        '@shared-styles': resolve(
          __dirname,
          '../../libs/shared/assets/src/lib/styles',
        ),
      },
    },
    plugins: [
      analog({
        prerender: {
          routes: [],
        },
        nitro: {
          preset: 'cloudflare_module',
          compatibilityDate: '2025-09-27',
          cloudflare: {
            dev: {
              environment: mode === 'development' ? 'dev' : 'prod',
            },
          },
          rollupConfig: {
            plugins: [
              // this solves the "Cannot find package" issue while importing
              // workspace libraries
              // ref: https://github.com/analogjs/analog/pull/792
              typescriptPaths({
                tsConfigPath: 'tsconfig.base.json',
                preserveExtensions: true,
              }),
            ],
          },
          routeRules: {
            '/parsowanie-i-mapowanie-odpowiedzi-z-api-z-wykorzystaniem-zod-js':
              {
                redirect: {
                  to: '/pl/parsowanie-i-mapowanie-odpowiedzi-z-api-z-wykorzystaniem-zod-js/',
                  statusCode: 301,
                },
              },
            '/sygnaly-w-angular-gleboka-analiza-dla-zapracowanych-deweloperow':
              {
                redirect: {
                  to: '/pl/sygnaly-w-angular-gleboka-analiza-dla-zapracowanych-deweloperow/',
                  statusCode: 301,
                },
              },
            '/najistotniejsze-zmiany-wprowadzone-w-nowej-wersji-typescripta-5-5':
              {
                redirect: {
                  to: '/pl/najistotniejsze-zmiany-wprowadzone-w-nowej-wersji-typescripta-5-5/',
                  statusCode: 301,
                },
              },
            '/przywracanie-pozycji-przewijania-scroll-w-angularze': {
              redirect: {
                to: '/pl/przywracanie-pozycji-przewijania-scroll-w-angularze/',
                statusCode: 301,
              },
            },
            '/angular-zmienna-szablonu-let-hit-czy-kit': {
              redirect: {
                to: '/pl/angular-zmienna-szablonu-let-hit-czy-kit/',
                statusCode: 301,
              },
            },
            '/kontroluj-bundle-size-aplikacji-z-bundlemon': {
              redirect: {
                to: '/pl/kontroluj-bundle-size-aplikacji-z-bundlemon/',
                statusCode: 301,
              },
            },
            '/wszystko-co-musisz-wiedziec-o-angular-router': {
              redirect: {
                to: '/pl/wszystko-co-musisz-wiedziec-o-angular-router/',
                statusCode: 301,
              },
            },
            '/testowanie-jednostkowe-widokow-z-blokami-defer': {
              redirect: {
                to: '/pl/testowanie-jednostkowe-widokow-z-blokami-defer/',
                statusCode: 301,
              },
            },
            '/angular-18-co-nowego': {
              redirect: {
                to: '/pl/angular-18-co-nowego/',
                statusCode: 301,
              },
            },
            '/signal-store-ngxs-zwiekszanie-elastycznosci-w-zarzadzaniu-stanem':
              {
                redirect: {
                  to: '/pl/signal-store-ngxs-zwiekszanie-elastycznosci-w-zarzadzaniu-stanem/',
                  statusCode: 301,
                },
              },
            '/jak-zoptymalizowac-bundle-size-angulara': {
              redirect: {
                to: '/pl/jak-zoptymalizowac-bundle-size-angulara/',
                statusCode: 301,
              },
            },
            '/jak-uzywac-bloku-defer-w-angularze-aby-zwiekszyc-wydajnosc': {
              redirect: {
                to: '/pl/jak-uzywac-bloku-defer-w-angularze-aby-zwiekszyc-wydajnosc/',
                statusCode: 301,
              },
            },
            '/wszystko-co-musisz-wiedziec-o-dependency-injection-w-angularze': {
              redirect: {
                to: '/pl/wszystko-co-musisz-wiedziec-o-dependency-injection-w-angularze/',
                statusCode: 301,
              },
            },
            '/zmiany-w-typescript-5-3': {
              redirect: {
                to: '/pl/zmiany-w-typescript-5-3/',
                statusCode: 301,
              },
            },
            '/microfrontendy-w-angularze-przyszlosc-skalowalnych-aplikacji-front-endowych':
              {
                redirect: {
                  to: '/pl/microfrontendy-w-angularze-przyszlosc-skalowalnych-aplikacji-front-endowych/',
                  statusCode: 301,
                },
              },
            '/przelom-w-zarzadzaniu-stanem-odkryj-prostote-signal-store-czesc-1':
              {
                redirect: {
                  to: '/pl/przelom-w-zarzadzaniu-stanem-odkryj-prostote-signal-store-czesc-1/',
                  statusCode: 301,
                },
              },
            '/zwieksz-wydajnosc-swojej-aplikacji-z-ngoptimizedimage': {
              redirect: {
                to: '/pl/zwieksz-wydajnosc-swojej-aplikacji-z-ngoptimizedimage/',
                statusCode: 301,
              },
            },
            '/jak-zbudowac-galerie-pokemonow-za-pomoca-nowego-przeplywu-sterowania-w-angular-17':
              {
                redirect: {
                  to: '/pl/jak-zbudowac-galerie-pokemonow-za-pomoca-nowego-przeplywu-sterowania-w-angular-17/',
                  statusCode: 301,
                },
              },
            '/analog-meta-framework-dla-angulara': {
              redirect: {
                to: '/pl/analog-meta-framework-dla-angulara/',
                statusCode: 301,
              },
            },
            '/angular-styles-masterclass': {
              redirect: {
                to: '/pl/angular-styles-masterclass/',
                statusCode: 301,
              },
            },
            '/miedzy-nami-dyrektywami-directive-composition-api': {
              redirect: {
                to: '/pl/miedzy-nami-dyrektywami-directive-composition-api/',
                statusCode: 301,
              },
            },
            '/angular-17-co-nowego': {
              redirect: {
                to: '/pl/angular-17-co-nowego/',
                statusCode: 301,
              },
            },
            '/bezproblemowe-wdrazanie-aplikacji-angularowej-z-uzyciem-vercel': {
              redirect: {
                to: '/pl/bezproblemowe-wdrazanie-aplikacji-angularowej-z-uzyciem-vercel/',
                statusCode: 301,
              },
            },
            '/internacjonalizacja-czyli-jak-otworzyc-aplikacje-na-swiat-czesc-2':
              {
                redirect: {
                  to: '/pl/internacjonalizacja-czyli-jak-otworzyc-aplikacje-na-swiat-czesc-2/',
                  statusCode: 301,
                },
              },
            '/internacjonalizacja-czyli-jak-otworzyc-aplikacje-na-swiat-czesc-1':
              {
                redirect: {
                  to: '/pl/internacjonalizacja-czyli-jak-otworzyc-aplikacje-na-swiat-czesc-1/',
                  statusCode: 301,
                },
              },
            '/znamy-nowy-syntax-dla-control-flow-w-angularze': {
              redirect: {
                to: '/pl/znamy-nowy-syntax-dla-control-flow-w-angularze/',
                statusCode: 301,
              },
            },
            '/angular-storybook-2': {
              redirect: {
                to: '/pl/angular-storybook-2/',
                statusCode: 301,
              },
            },
            '/poznaj-destroyref': {
              redirect: {
                to: '/pl/poznaj-destroyref/',
                statusCode: 301,
              },
            },
            '/skalowalna-i-modulowa-aplikacja-angular-z-nx': {
              redirect: {
                to: '/pl/skalowalna-i-modulowa-aplikacja-angular-z-nx/',
                statusCode: 301,
              },
            },
            '/programowanie-animacji-w-angularze': {
              redirect: {
                to: '/pl/programowanie-animacji-w-angularze/',
                statusCode: 301,
              },
            },
            '/dlaczego-sygnaly-nie-zastapia-rxjs': {
              redirect: {
                to: '/pl/dlaczego-sygnaly-nie-zastapia-rxjs/',
                statusCode: 301,
              },
            },
            '/wspoldzialanie-sygnalow-i-rxjs-w-angularze-na-praktycznym-przykladzie':
              {
                redirect: {
                  to: '/pl/wspoldzialanie-sygnalow-i-rxjs-w-angularze-na-praktycznym-przykladzie/',
                  statusCode: 301,
                },
              },
            '/angular-rozszerzanie-elementow-natywnych': {
              redirect: {
                to: '/pl/angular-rozszerzanie-elementow-natywnych/',
                statusCode: 301,
              },
            },
            '/sygnaly-w-angularze-16': {
              redirect: {
                to: '/pl/sygnaly-w-angularze-16/',
                statusCode: 301,
              },
            },
            '/co-nowego-w-angular-16': {
              redirect: {
                to: '/pl/co-nowego-w-angular-16/',
                statusCode: 301,
              },
            },
            '/wszystko-co-musisz-wiedziec-aby-rozpoczac-prace-z-ngxs': {
              redirect: {
                to: '/pl/wszystko-co-musisz-wiedziec-aby-rozpoczac-prace-z-ngxs/',
                statusCode: 301,
              },
            },
            '/czy-mozemy-w-pelni-zaufac-sanitizerom-html-i-jak-pracowac-bez-nich':
              {
                redirect: {
                  to: '/pl/czy-mozemy-w-pelni-zaufac-sanitizerom-html-i-jak-pracowac-bez-nich/',
                  statusCode: 301,
                },
              },
            '/nx-i-angular-elements-studium-przypadku': {
              redirect: {
                to: '/pl/nx-i-angular-elements-studium-przypadku/',
                statusCode: 301,
              },
            },
            '/angular-15-co-nowego': {
              redirect: {
                to: '/pl/angular-15-co-nowego/',
                statusCode: 301,
              },
            },
            '/angular-standalone-api': {
              redirect: {
                to: '/pl/angular-standalone-api/',
                statusCode: 301,
              },
            },
            '/typed-forms': {
              redirect: {
                to: '/pl/typed-forms/',
                statusCode: 301,
              },
            },
            '/cypress-wprowadzenie': {
              redirect: {
                to: '/pl/cypress-wprowadzenie/',
                statusCode: 301,
              },
            },
            '/co-nowego-w-ngrx-przeglad-zmian-i-praktyczne-wskazowki': {
              redirect: {
                to: '/pl/co-nowego-w-ngrx-przeglad-zmian-i-praktyczne-wskazowki/',
                statusCode: 301,
              },
            },
            '/teleportacja-w-angularze': {
              redirect: {
                to: '/pl/teleportacja-w-angularze/',
                statusCode: 301,
              },
            },
            '/angular-v14-co-warto-wiedziec': {
              redirect: {
                to: '/pl/angular-v14-co-warto-wiedziec/',
                statusCode: 301,
              },
            },
            '/ng-mocks-z-czym-to-sie-je': {
              redirect: {
                to: '/pl/ng-mocks-z-czym-to-sie-je/',
                statusCode: 301,
              },
            },
            '/backend-for-frontend-by-frontend': {
              redirect: {
                to: '/pl/backend-for-frontend-by-frontend/',
                statusCode: 301,
              },
            },
            '/angular-meetup-2-03-2022': {
              redirect: {
                to: '/pl/angular-meetup-2-03-2022/',
                statusCode: 301,
              },
            },
            '/angular-extended-diagnostics': {
              redirect: {
                to: '/pl/angular-extended-diagnostics/',
                statusCode: 301,
              },
            },
            '/sharing-is-caring-wersja-angular': {
              redirect: {
                to: '/pl/sharing-is-caring-wersja-angular/',
                statusCode: 301,
              },
            },
            '/template-driven-forms-i-reactive-forms': {
              redirect: {
                to: '/pl/template-driven-forms-i-reactive-forms/',
                statusCode: 301,
              },
            },
            '/rxjs-w-angularze-wiedza-w-pigulce': {
              redirect: {
                to: '/pl/rxjs-w-angularze-wiedza-w-pigulce/',
                statusCode: 301,
              },
            },
            '/angular-dependency-inversion-principle': {
              redirect: {
                to: '/pl/angular-dependency-inversion-principle/',
                statusCode: 301,
              },
            },
            '/angular-interface-segregation-principle': {
              redirect: {
                to: '/pl/angular-interface-segregation-principle/',
                statusCode: 301,
              },
            },
            '/angular-liskov-substitution-principle': {
              redirect: {
                to: '/pl/angular-liskov-substitution-principle/',
                statusCode: 301,
              },
            },
            '/angular-open-closed-principle': {
              redirect: {
                to: '/pl/angular-open-closed-principle/',
                statusCode: 301,
              },
            },
            '/angular-single-responsibility-principle': {
              redirect: {
                to: '/pl/angular-single-responsibility-principle/',
                statusCode: 301,
              },
            },
            '/angular-tips-tricks-cz-viii': {
              redirect: {
                to: '/pl/angular-tips-tricks-cz-viii/',
                statusCode: 301,
              },
            },
            '/ngwarsztaty-recenzja': {
              redirect: {
                to: '/pl/ngwarsztaty-recenzja/',
                statusCode: 301,
              },
            },
            '/angular-electron': {
              redirect: {
                to: '/pl/angular-electron/',
                statusCode: 301,
              },
            },
            '/pwa-angular-progressive-web-apps': {
              redirect: {
                to: '/pl/pwa-angular-progressive-web-apps/',
                statusCode: 301,
              },
            },
            '/jak-z-tworzenia-ui-stalem-sie-angular-developerem': {
              redirect: {
                to: '/pl/jak-z-tworzenia-ui-stalem-sie-angular-developerem/',
                statusCode: 301,
              },
            },
            '/kompendium-wiedzy-o-restrykcjach-na-etapie-kompilacji': {
              redirect: {
                to: '/pl/kompendium-wiedzy-o-restrykcjach-na-etapie-kompilacji/',
                statusCode: 301,
              },
            },
            '/rxjs7-co-nowego': {
              redirect: {
                to: '/pl/rxjs7-co-nowego/',
                statusCode: 301,
              },
            },
            '/behavior-driven-development-zlote-ale-czy-skromne': {
              redirect: {
                to: '/pl/behavior-driven-development-zlote-ale-czy-skromne/',
                statusCode: 301,
              },
            },
            '/wywiad-z-kamilem-mysliwcem': {
              redirect: {
                to: '/pl/wywiad-z-kamilem-mysliwcem/',
                statusCode: 301,
              },
            },
            '/angular-na-platformach-mobilnych': {
              redirect: {
                to: '/pl/angular-na-platformach-mobilnych/',
                statusCode: 301,
              },
            },
            '/nestjs-backend-w-stylu-angular': {
              redirect: {
                to: '/pl/nestjs-backend-w-stylu-angular/',
                statusCode: 301,
              },
            },
            '/ngrx-tips-tricks': {
              redirect: {
                to: '/pl/ngrx-tips-tricks/',
                statusCode: 301,
              },
            },
            '/nestjs-mockowanie-zewnetrznych-zaleznosci-w-testach-e2e-aplikacji':
              {
                redirect: {
                  to: '/pl/nestjs-mockowanie-zewnetrznych-zaleznosci-w-testach-e2e-aplikacji/',
                  statusCode: 301,
                },
              },
            '/angular-architects-nasza-opinia-na-temat-szkolen': {
              redirect: {
                to: '/pl/angular-architects-nasza-opinia-na-temat-szkolen/',
                statusCode: 301,
              },
            },
            '/angular-elements': {
              redirect: {
                to: '/pl/angular-elements/',
                statusCode: 301,
              },
            },
            '/angular-tree-shaking': {
              redirect: {
                to: '/pl/angular-tree-shaking/',
                statusCode: 301,
              },
            },
            '/ciemna-strona-server-side-renderingu': {
              redirect: {
                to: '/pl/ciemna-strona-server-side-renderingu/',
                statusCode: 301,
              },
            },
            '/jak-postepowac-zgodnie-z-zasada-odwrocenia-zaleznosci-dip-w-nestjs-i-angular':
              {
                redirect: {
                  to: '/pl/jak-postepowac-zgodnie-z-zasada-odwrocenia-zaleznosci-dip-w-nestjs-i-angular/',
                  statusCode: 301,
                },
              },
            '/black-friday-z-angular-love': {
              redirect: {
                to: '/pl/black-friday-z-angular-love/',
                statusCode: 301,
              },
            },
            '/przywitaj-nan-stack': {
              redirect: {
                to: '/pl/przywitaj-nan-stack/',
                statusCode: 301,
              },
            },
            '/last-minute-200-na-najwieksza-konferencje-z-ng-conf': {
              redirect: {
                to: '/pl/last-minute-200-na-najwieksza-konferencje-z-ng-conf/',
                statusCode: 301,
              },
            },
            '/ngrxcomponent': {
              redirect: {
                to: '/pl/ngrxcomponent/',
                statusCode: 301,
              },
            },
            '/ngrx-nie-tylko-store': {
              redirect: {
                to: '/pl/ngrx-nie-tylko-store/',
                statusCode: 301,
              },
            },
            '/angular-nieco-inne-podejscie-do-personalizowania-szablonu-komponentow':
              {
                redirect: {
                  to: '/pl/angular-nieco-inne-podejscie-do-personalizowania-szablonu-komponentow/',
                  statusCode: 301,
                },
              },
            '/zagniezdzone-formularze-z-controlcontainer': {
              redirect: {
                to: '/pl/zagniezdzone-formularze-z-controlcontainer/',
                statusCode: 301,
              },
            },
            '/angular-tips-tricks-cz-vii': {
              redirect: {
                to: '/pl/angular-tips-tricks-cz-vii/',
                statusCode: 301,
              },
            },
            '/spectator-kiedy-testowanie-staje-sie-przyjemnoscia': {
              redirect: {
                to: '/pl/spectator-kiedy-testowanie-staje-sie-przyjemnoscia/',
                statusCode: 301,
              },
            },
            '/komponenty-dynamiczne-drzewo': {
              redirect: {
                to: '/pl/komponenty-dynamiczne-drzewo/',
                statusCode: 301,
              },
            },
            '/ng-conf-kod-znizkowy-konferencja-online': {
              redirect: {
                to: '/pl/ng-conf-kod-znizkowy-konferencja-online/',
                statusCode: 301,
              },
            },
            '/real-live-case-dyrektywa-do-obslugi-rol': {
              redirect: {
                to: '/pl/real-live-case-dyrektywa-do-obslugi-rol/',
                statusCode: 301,
              },
            },
            '/ngrx-praktycznie-garsc-wskazowek': {
              redirect: {
                to: '/pl/ngrx-praktycznie-garsc-wskazowek/',
                statusCode: 301,
              },
            },
            '/dokumentowanie-aplikacji-angular-poprzez-compodoc': {
              redirect: {
                to: '/pl/dokumentowanie-aplikacji-angular-poprzez-compodoc/',
                statusCode: 301,
              },
            },
            '/angular-schematics-tutorial': {
              redirect: {
                to: '/pl/angular-schematics-tutorial/',
                statusCode: 301,
              },
            },
            '/testowanie-rxjs-marble-diagrams': {
              redirect: {
                to: '/pl/testowanie-rxjs-marble-diagrams/',
                statusCode: 301,
              },
            },
            '/o-server-side-rendering-w-angular': {
              redirect: {
                to: '/pl/o-server-side-rendering-w-angular/',
                statusCode: 301,
              },
            },
            '/testowanie-ngrx-komponenty': {
              redirect: {
                to: '/pl/testowanie-ngrx-komponenty/',
                statusCode: 301,
              },
            },
            '/testowanie-ngrx-jak-zaczac': {
              redirect: {
                to: '/pl/testowanie-ngrx-jak-zaczac/',
                statusCode: 301,
              },
            },
            '/angular-7-co-nowego': {
              redirect: {
                to: '/pl/angular-7-co-nowego/',
                statusCode: 301,
              },
            },
            '/confrontjs-wygraj-bilet': {
              redirect: {
                to: '/pl/confrontjs-wygraj-bilet/',
                statusCode: 301,
              },
            },
            '/konferencja-ngpoland-jspoland-2018-wygraj-bilet': {
              redirect: {
                to: '/pl/konferencja-ngpoland-jspoland-2018-wygraj-bilet/',
                statusCode: 301,
              },
            },
            '/angular-skad-czerpac-wiedze': {
              redirect: {
                to: '/pl/angular-skad-czerpac-wiedze/',
                statusCode: 301,
              },
            },
            '/profiling-w-angular': {
              redirect: {
                to: '/pl/profiling-w-angular/',
                statusCode: 301,
              },
            },
            '/angular-firebase-crud-login-cz-i': {
              redirect: {
                to: '/pl/angular-firebase-crud-login-cz-i/',
                statusCode: 301,
              },
            },
            '/angular-performance-tips': {
              redirect: {
                to: '/pl/angular-performance-tips/',
                statusCode: 301,
              },
            },
            '/angular-6-1-0-scroll-behavior-viewportscroller': {
              redirect: {
                to: '/pl/angular-6-1-0-scroll-behavior-viewportscroller/',
                statusCode: 301,
              },
            },
            '/angular-tips-tricks-cz-vi': {
              redirect: {
                to: '/pl/angular-tips-tricks-cz-vi/',
                statusCode: 301,
              },
            },
            '/rxjs-w-angular-co-wypada-wiedziec': {
              redirect: {
                to: '/pl/rxjs-w-angular-co-wypada-wiedziec/',
                statusCode: 301,
              },
            },
            '/rxjs-share-operator': {
              redirect: {
                to: '/pl/rxjs-share-operator/',
                statusCode: 301,
              },
            },
            '/angular-asynchroniczne-walidatory': {
              redirect: {
                to: '/pl/angular-asynchroniczne-walidatory/',
                statusCode: 301,
              },
            },
            '/angular-injectiontoken': {
              redirect: {
                to: '/pl/angular-injectiontoken/',
                statusCode: 301,
              },
            },
            '/angular-i-zone-js': {
              redirect: {
                to: '/pl/angular-i-zone-js/',
                statusCode: 301,
              },
            },
            '/angular-testowanie-zapytan-http': {
              redirect: {
                to: '/pl/angular-testowanie-zapytan-http/',
                statusCode: 301,
              },
            },
            '/angular-dekorator-hostbinding': {
              redirect: {
                to: '/pl/angular-dekorator-hostbinding/',
                statusCode: 301,
              },
            },
            '/angular-tips-tricks-cz-v': {
              redirect: {
                to: '/pl/angular-tips-tricks-cz-v/',
                statusCode: 301,
              },
            },
            '/angular-v-5-0-0-co-nowego': {
              redirect: {
                to: '/pl/angular-v-5-0-0-co-nowego/',
                statusCode: 301,
              },
            },
            '/angular-ngfortemplate-ngforofcontext': {
              redirect: {
                to: '/pl/angular-ngfortemplate-ngforofcontext/',
                statusCode: 301,
              },
            },
            '/wyniki-konkursu-o-wejsciowki-na-ng-poland': {
              redirect: {
                to: '/pl/wyniki-konkursu-o-wejsciowki-na-ng-poland/',
                statusCode: 301,
              },
            },
            '/konferencja-ng-poland-2017-wygraj-bilet': {
              redirect: {
                to: '/pl/konferencja-ng-poland-2017-wygraj-bilet/',
                statusCode: 301,
              },
            },
            '/angular-tips-tricks-cz-iv': {
              redirect: {
                to: '/pl/angular-tips-tricks-cz-iv/',
                statusCode: 301,
              },
            },
            '/angular-multiple-environments': {
              redirect: {
                to: '/pl/angular-multiple-environments/',
                statusCode: 301,
              },
            },
            '/angular-dyrektywy-strukturalne': {
              redirect: {
                to: '/pl/angular-dyrektywy-strukturalne/',
                statusCode: 301,
              },
            },
            '/angular-router-events-i-spinner': {
              redirect: {
                to: '/pl/angular-router-events-i-spinner/',
                statusCode: 301,
              },
            },
            '/konferencja-frontend-con-2017': {
              redirect: {
                to: '/pl/konferencja-frontend-con-2017/',
                statusCode: 301,
              },
            },
            '/angular-candeactivate-guard': {
              redirect: {
                to: '/pl/angular-candeactivate-guard/',
                statusCode: 301,
              },
            },
            '/angular-tips-tricks-cz-iii': {
              redirect: {
                to: '/pl/angular-tips-tricks-cz-iii/',
                statusCode: 301,
              },
            },
            '/wyniki-konkursu-js-poland-i-blog-www-polskifrontend-pl': {
              redirect: {
                to: '/pl/wyniki-konkursu-js-poland-i-blog-www-polskifrontend-pl/',
                statusCode: 301,
              },
            },
            '/angular-manipulacja-dom-w-roznych-srodowiskach': {
              redirect: {
                to: '/pl/angular-manipulacja-dom-w-roznych-srodowiskach/',
                statusCode: 301,
              },
            },
            '/konferencja-js-poland-2017-wygraj-bilet-lub-skorzystaj-ze-znizki':
              {
                redirect: {
                  to: '/pl/konferencja-js-poland-2017-wygraj-bilet-lub-skorzystaj-ze-znizki/',
                  statusCode: 301,
                },
              },
            '/angular-2-custom-form-controls': {
              redirect: {
                to: '/pl/angular-2-custom-form-controls/',
                statusCode: 301,
              },
            },
            '/angular-2-tips-tricks-cz-ii': {
              redirect: {
                to: '/pl/angular-2-tips-tricks-cz-ii/',
                statusCode: 301,
              },
            },
            '/angular-2-sharedmodule-w-wiekszych-projektach': {
              redirect: {
                to: '/pl/angular-2-sharedmodule-w-wiekszych-projektach/',
                statusCode: 301,
              },
            },
            '/angular-2-tips-tricks-cz-i': {
              redirect: {
                to: '/pl/angular-2-tips-tricks-cz-i/',
                statusCode: 301,
              },
            },
            '/angular-2-validation-service-usprawniamy-wyswietlanie-errorow': {
              redirect: {
                to: '/pl/angular-2-validation-service-usprawniamy-wyswietlanie-errorow/',
                statusCode: 301,
              },
            },
            '/angular-2-custom-validators': {
              redirect: {
                to: '/pl/angular-2-custom-validators/',
                statusCode: 301,
              },
            },
            '/angular-2-model-driven-forms-dynamiczne-formularze': {
              redirect: {
                to: '/pl/angular-2-model-driven-forms-dynamiczne-formularze/',
                statusCode: 301,
              },
            },
            '/angular-2-model-driven-forms-cz-ii-zmiana-zasad-walidacji-w-locie':
              {
                redirect: {
                  to: '/pl/angular-2-model-driven-forms-cz-ii-zmiana-zasad-walidacji-w-locie/',
                  statusCode: 301,
                },
              },
            '/angular-2-model-driven-forms-cz-i-tworzymy-formularz-z-walidacja':
              {
                redirect: {
                  to: '/pl/angular-2-model-driven-forms-cz-i-tworzymy-formularz-z-walidacja/',
                  statusCode: 301,
                },
              },
            '/angular-2-template-driven-forms': {
              redirect: {
                to: '/pl/angular-2-template-driven-forms/',
                statusCode: 301,
              },
            },
            '/angular-2-lifecycle-hooks-ngonchanges-ngoncheck': {
              redirect: {
                to: '/pl/angular-2-lifecycle-hooks-ngonchanges-ngoncheck/',
                statusCode: 301,
              },
            },
            '/angular-2-change-detector-mechanizmy-detekcji-oraz-strategia-onpush':
              {
                redirect: {
                  to: '/pl/angular-2-change-detector-mechanizmy-detekcji-oraz-strategia-onpush/',
                  statusCode: 301,
                },
              },
            '/angular-2-format-date-pipe': {
              redirect: {
                to: '/pl/angular-2-format-date-pipe/',
                statusCode: 301,
              },
            },
            '/angular-2-injector-tree-jak-dzialaja-serwisy': {
              redirect: {
                to: '/pl/angular-2-injector-tree-jak-dzialaja-serwisy/',
                statusCode: 301,
              },
            },
            '/angular-2-augury-debugging-aplikacji': {
              redirect: {
                to: '/pl/angular-2-augury-debugging-aplikacji/',
                statusCode: 301,
              },
            },
            '/angular-2-bidrectional-service-komunikacja-komponentow-poprzez-serwis':
              {
                redirect: {
                  to: '/pl/angular-2-bidrectional-service-komunikacja-komponentow-poprzez-serwis/',
                  statusCode: 301,
                },
              },
            '/angular-2-dynamic-component-tworzymy-dynamiczne-komponenty': {
              redirect: {
                to: '/pl/angular-2-dynamic-component-tworzymy-dynamiczne-komponenty/',
                statusCode: 301,
              },
            },
            '/angular-2-resolver-dostarczamy-dane-przed-aktywacja-routa': {
              redirect: {
                to: '/pl/angular-2-resolver-dostarczamy-dane-przed-aktywacja-routa/',
                statusCode: 301,
              },
            },
          },
        },
      }),
      nxViteTsPaths(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
    },
  };
});
