import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localePl from '@angular/common/locales/pl';
import { isDevMode, LOCALE_ID } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';

import { AlLocalizeService } from '@angular-love/blog/i18n/util';

import { I18nHeadersInterceptor } from './i18n-headers.interceptor';
import { LocaleIdProvider } from './locale-id.provider';
import { TranslocoHttpLoader } from './transloco.loader';

registerLocaleData(localePl);

export const provideI18n = () => {
  return [
    provideTransloco({
      config: {
        availableLangs: ['pl', 'en'],
        defaultLang: 'pl',
        fallbackLang: 'pl',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: I18nHeadersInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useClass: LocaleIdProvider },
    AlLocalizeService,
  ];
};
