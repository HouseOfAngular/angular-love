import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { isDevMode, LOCALE_ID } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';

import { LocaleIdProvider } from '@angular-love/blog/i18n/data-access';
import { AlI18nService, AlLocalizeService } from '@angular-love/blog/i18n/util';

import { TranslocoAnalogLoader } from './loader';

registerLocaleData(localePl);

export const provideAnalogI18n = () => {
  return [
    provideTransloco({
      config: {
        availableLangs: ['en', 'pl'],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoAnalogLoader,
    }),
    { provide: LOCALE_ID, useClass: LocaleIdProvider },
    AlLocalizeService,
    AlI18nService,
  ];
};
