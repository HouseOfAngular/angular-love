import { provideConfig } from '@angular-love/shared/config';

import { AppEnvironment } from './app-environment';
import { provideAppTracking } from "../app/providers/tracking";

export const environment: AppEnvironment = {
  baseUrl: process.env.AL_BASE_URL,
  providers: [
    provideConfig({
      baseUrl: process.env.AL_BASE_URL,
      apiBaseUrl: process.env.AL_API_URL,
      algoliaApplicationId: process.env.AL_ALGOLIA_APPLICATION_ID,
      algoliaIndexName: process.env.AL_ALGOLIA_INDEX_NAME,
      algoliaApiKey: process.env.AL_ALGOLIA_API_KEY,
      giscusRepo: process.env.AL_GISCUS_REPO,
      giscusRepoId: process.env.AL_GISCUS_REPO_ID,
      giscusCategory: process.env.AL_GISCUS_CATEGORY,
      giscusCategoryId: process.env.AL_GISCUS_CATEGORY_ID,
    }),
    provideAppTracking(),
  ],
};
