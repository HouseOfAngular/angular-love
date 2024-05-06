import { provideConfig } from '@angular-love/shared/config';

import { AppEnvironment } from './app-environment';

export const environment: AppEnvironment = {
  providers: [
    provideConfig({
      apiBaseUrl: process.env.AL_API_URL,
      alAlgoliaApplicationId: process.env.AL_ALGOLIA_APPLICATION_ID,
      alAlgoliaIndexName: process.env.AL_ALGOLIA_INDEX_NAME,
      alAlgoliaApiKey: process.env.AL_ALGOLIA_API_KEY,
    }),
  ],
};
