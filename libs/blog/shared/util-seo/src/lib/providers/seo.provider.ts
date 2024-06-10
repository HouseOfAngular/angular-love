import {
  APP_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';

import { SeoService } from '../services';
import { SEO_CONFIG, SeoConfig } from '../tokens';

export const provideSeo = (config?: SeoConfig): EnvironmentProviders => {
  const defaultConfig: SeoConfig = {
    locale: 'en_US',
    description:
      'Angular.love - ciekawostki oraz rozwiązania dla średnio-zaawansowanych oraz zaawansowanych developerów Angulara.',
    title: 'Angular.love',
    siteName: 'Angular.love',
  };

  return makeEnvironmentProviders([
    {
      provide: SEO_CONFIG,
      useValue: config || defaultConfig,
    },
    SeoService,
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const seoService = inject(SeoService);
        return () => {
          seoService.init();
        };
      },
      multi: true,
    },
  ]);
};
