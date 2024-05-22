import { Provider } from '@angular/core';

import { ALGOLIA_CLIENT_CONFIG, AlgoliaClientConfig } from './algolia.config';
import { AlgoliaClientService } from './algolia.service';

type AlgoliaConfigProvider =
  | {
      useFactory: () => AlgoliaClientConfig;
    }
  | {
      useValue: AlgoliaClientConfig;
    };

export function provideAlgolia(
  configProvider: AlgoliaConfigProvider,
): Provider[] {
  return [
    {
      provide: ALGOLIA_CLIENT_CONFIG,
      ...configProvider,
    },
    AlgoliaClientService,
  ];
}
