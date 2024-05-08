import { provideConfig } from '@angular-love/shared/config';

import { AppEnvironment } from './app-environment';

export const environment: AppEnvironment = {
  providers: [
    provideConfig({
      apiBaseUrl: process.env.AL_API_URL,
      algoliaApplicationId: process.env.AL_ALGOLIA_APPLICATION_ID,
      algoliaIndexName: process.env.AL_ALGOLIA_INDEX_NAME,
      algoliaApiKey: process.env.AL_ALGOLIA_API_KEY,
    }),
  ],
};
