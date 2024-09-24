import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  IsActiveMatchOptions,
  provideRouter,
  Router,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { provideFastSVG } from '@push-based/ngx-fast-svg';

import { provideI18n } from '@angular-love/blog/i18n/data-access';
import { blogShellRoutes } from '@angular-love/blog/shell/feature';

import { environment } from '../environments/environment';

import { provideAppSeo } from './providers/seo-provider';
import { provideSkeletonConfig } from './providers/skeleton-config-provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      blogShellRoutes,
      // withDisabledInitialNavigation(),
      withComponentInputBinding(),
      withViewTransitions({
        onViewTransitionCreated: ({ transition }) => {
          const router = inject(Router);
          const targetUrl = router.getCurrentNavigation()!.finalUrl!;
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
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideExperimentalZonelessChangeDetection(),
    provideClientHydration(),
    provideAppSeo(),
    provideSkeletonConfig(),
    provideFastSVG({
      url: (name: string) => `assets/icons/${name}.svg`,
    }),
    provideAnimationsAsync(),
    environment.providers,
  ],
};
