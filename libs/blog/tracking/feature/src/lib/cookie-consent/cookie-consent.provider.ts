import { isPlatformBrowser } from '@angular/common';
import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideAppInitializer,
} from '@angular/core';
import type { CookieConsentConfig } from 'vanilla-cookieconsent';

import { CookieConsentService } from './cookie-consent.service';

export const provideCookieConsent = (
  config: CookieConsentConfig,
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
              cc.run(config);
            });
          }
        };
      })();
      return initializerFn();
    }),
  ]);
};
