import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, PLATFORM_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { IsActiveMatchOptions, provideRouter, Router, withComponentInputBinding, withInMemoryScrolling, withRouterConfig, withViewTransitions } from '@angular/router';
import { provideFastSVG } from '@push-based/ngx-fast-svg';



import { provideI18n } from '@angular-love/blog/i18n/data-access';
import { blogShellRoutes } from '@angular-love/blog/shell/feature';
import { provideConfig } from '@angular-love/shared/config';



import { provideAppSeo } from '../../../blog/src/app/providers/seo-provider';
import { provideSkeletonConfig } from '../../../blog/src/app/providers/skeleton-config-provider';
import { provideAppTracking } from '../../../blog/src/app/providers/tracking';



import HomeComponent from './pages/home.page';
import { API_PREFIX } from '@analogjs/router/tokens';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // provideFileRouter(),
    provideRouter(
      blogShellRoutes,
      // [
      //   {
      //     path: '',
      //     component: HomeComponent,
      //   },
      // ],
      // withDisabledInitialNavigation(),
      withComponentInputBinding(),
      withViewTransitions({
        onViewTransitionCreated: ({ transition }) => {
          const router = inject(Router);
          const targetUrl = router.currentNavigation()!.finalUrl!;
          // Skip the transition if the only thing
          // changing is the fragment and queryParams
          const config: IsActiveMatchOptions = {
            paths: 'exact',
            matrixParams: 'exact',
            fragment: 'ignored',
            queryParams: 'ignored',
          };

          if (router.isActive(targetUrl, config)) {
            transition.skipTransition();
          }
        },
      }),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top',
      }),
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
    ),
    provideI18n(),
    provideClientHydration(),

    // we do not use file router, so we have to provide prefix manually
    {
      provide: API_PREFIX,
      useValue: 'api'
    },
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor]),
    ),
    provideAppSeo(),
    provideSkeletonConfig(),
    provideConfig({
      baseUrl: import.meta.env['VITE_AL_BASE_URL'],
      apiBaseUrl: import.meta.env['VITE_AL_API_URL'],
      algoliaApplicationId: import.meta.env['VITE_AL_ALGOLIA_APPLICATION_ID'],
      algoliaIndexName: import.meta.env['VITE_AL_ALGOLIA_INDEX_NAME'],
      algoliaApiKey: import.meta.env['VITE_AL_ALGOLIA_API_KEY'],
      giscusRepo: import.meta.env['VITE_AL_GISCUS_REPO'],
      giscusRepoId: import.meta.env['VITE_AL_GISCUS_REPO_ID'],
      giscusCategory: import.meta.env['VITE_AL_GISCUS_CATEGORY'],
      giscusCategoryId: import.meta.env['VITE_AL_GISCUS_CATEGORY_ID'],
    }),
    provideFastSVG({
      url: (name: string) => `assets/icons/${name}.svg`,
    }),
    // provideAppTracking(),
  ],
};
