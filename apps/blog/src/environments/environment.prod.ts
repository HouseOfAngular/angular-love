import { provideConfig } from '@angular-love/shared/config';
import { AppEnvironment } from './app-environment';

export const environment: AppEnvironment = {
  providers: [
    provideConfig({
      apiBaseUrl: 'https://bff.ngdom.in',
    }),
  ],
};
