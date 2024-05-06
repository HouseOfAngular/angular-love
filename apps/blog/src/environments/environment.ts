import * as process from 'process';

import { provideConfig } from '@angular-love/shared/config';

import { AppEnvironment } from './app-environment';

export const environment: AppEnvironment = {
  providers: [
    provideConfig({
      apiBaseUrl: process.env.AL_API_URL,
      alGraphqlUrl: process.env.AL_GRAPHQL_URI,
      alGraphqlToken: process.env.AL_GRAPHQL_TOKEN,
      alIsProd: process.env.AL_IS_PROD,
    }),
  ],
};
