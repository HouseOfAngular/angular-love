import { requestContextInterceptor } from '@analogjs/router';
import { API_PREFIX } from '@analogjs/router/tokens';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import {
  IsActiveMatchOptions,
  provideRouter,
  Router,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { provideFastSVG } from '@push-based/ngx-fast-svg';
import { NGX_SKELETON_LOADER_CONFIG } from 'ngx-skeleton-loader';
import { map, switchMap } from 'rxjs';

import { provideI18n } from '@angular-love/blog/i18n/data-access';
import { blogShellRoutes } from '@angular-love/blog/shell/feature';
import { provideSeo } from '@angular-love/seo';
import { ConfigService, provideConfig } from '@angular-love/shared/config';
import { convertLangToLocale } from '@angular-love/shared/utils-i18n';

// import { provideAppTracking } from '../../../blog/src/app/providers/tracking';

// apps/blog/src/app/providers/skeleton-config-provider.ts
function provideSkeletonConfig(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: NGX_SKELETON_LOADER_CONFIG,
      useFactory: () => {
        //todo adjust animation once light mode will be done
        return {
          animation: 'progress-dark',
          theme: {
            extendsFromRoot: true,
            backgroundColor: 'rgba(var(--card))',
          },
        };
      },
    },
  ]);
}

//  apps/blog/src/app/providers/seo-provider.ts
function provideAppSeo(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideSeo({
      useFactory: () => {
        const transloco = inject(TranslocoService);
        const baseUrl = inject(ConfigService).get<string>('baseUrl');
        return transloco.langChanges$.pipe(
          switchMap((lang) => transloco.load(lang)),
          map(() => ({
            title: 'Angular.love',
            siteName: 'Angular.love',
            baseUrl: baseUrl,
            locale: convertLangToLocale(transloco.getActiveLang()),
            description: transloco.translate('seo.metaDescription'),
          })),
        );
      },
    }),
  ]);
}

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
      useValue: 'api',
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
