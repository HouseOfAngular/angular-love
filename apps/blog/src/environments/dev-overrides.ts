import { provideConfig } from '@angular-love/shared/config';

import { AppEnvironment } from './app-environment';

export const devOverrides: AppEnvironment = {
  providers: [
    provideConfig({
      apiBaseUrl: 'https://blog-bff-dev.contact-ef8.workers.dev',
      algoliaApplicationId: 'XLADYRKB10',
      algoliaIndexName: 'testing_angularlovesearchable_posts',
      algoliaApiKey: '1b97132f81687e74323b314b24711b0c',
    }),
  ],
};
