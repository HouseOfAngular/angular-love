import { isPlatformBrowser } from '@angular/common';
import {
  APP_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
} from '@angular/core';
import type { CookieConsentConfig } from 'vanilla-cookieconsent';

import { provideCookieConsent } from './cookie-consent/cookie-consent.provider';
import {
  PartyTownConfig,
  PartyTownService,
  providePartyTown,
} from './partytown';
import { ScriptFactory, ScriptsLoader } from './scripts-loader';
import { ScriptsLoaderService } from './scripts-loader.service';

export type TrackingConfig = {
  partyTown: PartyTownConfig;
  cookieConsent: CookieConsentConfig;
  scripts?: ScriptFactory[];
};

export const provideTracking = (
  config: TrackingConfig,
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    ...(config.partyTown?.enabled
      ? [
          providePartyTown(config.partyTown),
          {
            provide: ScriptsLoader,
            useClass: PartyTownService,
          },
        ]
      : [
          ScriptsLoaderService,
          {
            provide: ScriptsLoader,
            useClass: ScriptsLoaderService,
          },
        ]),
    provideCookieConsent(config.cookieConsent),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);
        const scriptsLoader = inject(ScriptsLoader);

        return () => {
          if (isPlatformBrowser(platformId)) {
            scriptsLoader.init(config.scripts ?? []);
          }
        };
      },
    },
  ]);
};
