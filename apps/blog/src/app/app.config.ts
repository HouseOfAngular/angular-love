import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, inject } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import {
  IsActiveMatchOptions,
  provideRouter,
  Router,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';

import { blogShellRoutes } from '@angular-love/blog/shell/feature';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      blogShellRoutes,
      withEnabledBlockingInitialNavigation(),
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
    provideHttpClient(withFetch()),
    provideClientHydration(),
    environment.providers,
  ],
};
