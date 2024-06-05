import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { provideTransloco } from '@ngneat/transloco';
import {
  LOCALIZE_ROUTER_CONFIG,
  localizeRouterConfig,
  LocalizeRouterModule,
} from '@penleychan/ngx-transloco-router';

import { I18nHeadersInterceptor } from './i18n-headers.interceptor';
import { TranslocoHttpLoader } from './transloco.loader';

export const provideI18n = (props: { routes: Routes }) => {
  return [
    importProvidersFrom(LocalizeRouterModule.forRoot(props.routes)),
    provideTransloco({
      config: {
        availableLangs: ['en', 'pl'],
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
      }),
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: I18nHeadersInterceptor,
      multi: true,
    },
  ];
};
