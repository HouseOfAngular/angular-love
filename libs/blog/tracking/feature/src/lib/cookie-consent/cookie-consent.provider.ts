import { isPlatformBrowser } from '@angular/common';
import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideAppInitializer,
} from '@angular/core';

import { CookieConsentService } from './cookie-consent.service';
import { CreateCookieConsentConfigFn } from './models';

export const provideCookieConsent = (
  config: CreateCookieConsentConfigFn,
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    CookieConsentService,
    provideAppInitializer(() => {
      const initializerFn = (() => {
        const platformId = inject(PLATFORM_ID);
        const cookieConsentService = inject(CookieConsentService);

        return () => {
          if (isPlatformBrowser(platformId)) {
            cookieConsentService.cookieConsent.subscribe((cc) => {
              cc.run(config(cc));
            });
          }
        };
      })();
      return initializerFn();
    }),
  ]);
};
