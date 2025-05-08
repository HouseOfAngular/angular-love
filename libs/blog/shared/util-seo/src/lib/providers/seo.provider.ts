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
        return () => {
          seoService.init();
        };
      })();
      return initializerFn();
    }),
  ]);
};
