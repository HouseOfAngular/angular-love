import { inject, Provider } from '@angular/core';

import { ConfigService } from '@angular-love/shared/config';
import { provideAlgolia } from '@angular-love/shared/utils-algolia';

import { AlgoliaSearchService, SearchService } from '../infrastructure';

export function provideSearch(): Provider[] {
  return [
    provideAlgolia({
      useFactory: () => {
        const config = inject(ConfigService);

        return {
          applicationId: config.get<string>('algoliaApplicationId'),
          apKey: config.get<string>('algoliaApiKey'),
          indexName: config.get<string>('algoliaIndexName'),
        };
      },
    }),
    {
      provide: SearchService,
      useClass: AlgoliaSearchService,
    },
  ];
}
