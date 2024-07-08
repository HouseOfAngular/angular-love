import { isPlatformBrowser } from '@angular/common';
import {
  APP_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
} from '@angular/core';
import type { CookieConsentConfig } from 'vanilla-cookieconsent';

import { CookieConsentService } from './cookie-consent.service';

export const provideCookieConsent = (
  config: CookieConsentConfig,
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    CookieConsentService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);
        const cookieConsentService = inject(CookieConsentService);

        return () => {
          if (isPlatformBrowser(platformId)) {
            cookieConsentService.cookieConsent.subscribe((cc) => {
              cc.run(config);
            });
          }
        };
      },
    },
  ]);
};
