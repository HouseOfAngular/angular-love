import { provideConfig } from '@angular-love/shared/config';
import { AppEnvironment } from './app-environment';
import { devOverrides } from './dev-overrides';

export const environment: AppEnvironment = {
  providers: [
    provideConfig({
      apiBaseUrl: 'https://bff.ngdom.in',
    }),
    ...devOverrides.providers,
  ],
};
