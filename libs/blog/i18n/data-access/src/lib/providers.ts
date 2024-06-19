import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localePl from '@angular/common/locales/pl';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { Routes } from '@angular/router';
import { provideTransloco } from '@ngneat/transloco';
import {
  LOCALIZE_ROUTER_CONFIG,
  localizeRouterConfig,
  LocalizeRouterModule,
} from '@penleychan/ngx-transloco-router';

import { I18nHeadersInterceptor } from './i18n-headers.interceptor';
import { LocaleIdProvider } from './locale-id.provider';
import { TranslocoHttpLoader } from './transloco.loader';

registerLocaleData(localePl);

export const provideI18n = (props: { routes: Routes }) => {
  return [
    importProvidersFrom(LocalizeRouterModule.forRoot(props.routes)),
    provideTransloco({
      config: {
        availableLangs: ['pl', 'en'],
        defaultLang: 'pl',
        fallbackLang: 'pl',
        reRenderOnLangChange: true,
        prodMode: false, //@todo: change to !isDevMode()
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: LOCALIZE_ROUTER_CONFIG,
      useValue: localizeRouterConfig({
        translateRoute: true,
        initialNavigation: true,
        alwaysSetPrefix: false,
        // force fallback language to not be overridden by the browser lang
        // default: this._cachedLang || browserLang || this.locales[0];
        defaultLangFunction: () => 'pl',
      }),
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: I18nHeadersInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useClass: LocaleIdProvider },
  ];
};
