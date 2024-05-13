import { InjectionToken } from '@angular/core';

export type AlgoliaClientConfig = {
  applicationId: string;
  apKey: string;
  indexName: string;
};

export const ALGOLIA_CLIENT_CONFIG = new InjectionToken<AlgoliaClientConfig>(
  'Algolia Client Config',
);
