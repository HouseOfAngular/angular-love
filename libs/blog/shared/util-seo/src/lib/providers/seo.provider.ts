import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { Observable } from 'rxjs';

import { SeoService } from '../services';
import { SEO_CONFIG, SeoConfig } from '../tokens';

type SeoProvider =
  | {
      useFactory: () => Observable<SeoConfig>;
    }
  | {
      useValue: Observable<SeoConfig>;
    };

export const provideSeo = (seoProvider: SeoProvider): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: SEO_CONFIG,
      ...seoProvider,
    },
    SeoService,
    provideAppInitializer(() => {
      const initializerFn = (() => {
        const seoService = inject(SeoService);
        // Returned so Angular awaits it — init() primes the cached base config
        // that store-managed routes need during their route guard.
        return () => seoService.init();
      })();
      return initializerFn();
    }),
  ]);
};
