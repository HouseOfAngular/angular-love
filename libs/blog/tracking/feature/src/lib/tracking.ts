import { isPlatformBrowser } from '@angular/common';
import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideAppInitializer,
} from '@angular/core';
import type { CookieConsentConfig } from 'vanilla-cookieconsent';

import { provideCookieConsent } from './cookie-consent/cookie-consent.provider';
import {
  PartyTownConfig,
  PartyTownService,
  providePartyTown,
} from './partytown';
import { PixelFactory, ScriptFactory, ScriptsLoader } from './scripts-loader';
import { ScriptsLoaderService } from './scripts-loader.service';

export type TrackingConfig = {
  partyTown: PartyTownConfig;
  cookieConsent: CookieConsentConfig;
  scripts?: ScriptFactory[];
  pixels?: PixelFactory[];
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
    provideAppInitializer(() => {
      const initializerFn = (() => {
        const platformId = inject(PLATFORM_ID);
        const scriptsLoader = inject(ScriptsLoader);

        return () => {
          if (isPlatformBrowser(platformId)) {
            scriptsLoader.init(config.scripts ?? [], config.pixels ?? []);
          }
        };
      })();
      return initializerFn();
    }),
  ]);
};
