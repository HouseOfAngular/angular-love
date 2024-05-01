import { provideConfig } from '@angular-love/shared/config';

import { AppEnvironment } from './app-environment';

export const environment: AppEnvironment = {
  providers: [
    provideConfig({
      apiBaseUrl: process.env.AL_API_URL,
    }),
  ],
};
