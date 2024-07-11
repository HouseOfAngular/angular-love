import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { map, switchMap } from 'rxjs';

import { provideSeo } from '@angular-love/seo';
import { ConfigService } from '@angular-love/shared/config';
import { convertLangToLocale } from '@angular-love/shared/utils-i18n';

export function provideAppSeo(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideSeo({
      useFactory: () => {
        const transloco = inject(TranslocoService);
        const baseUrl = inject(ConfigService).get<string>('baseUrl');
        return transloco.langChanges$.pipe(
          switchMap((lang) => transloco.load(lang)),
          map(() => ({
            title: 'Angular.love',
            siteName: 'Angular.love',
            baseUrl: baseUrl,
            locale: convertLangToLocale(transloco.getActiveLang()),
            description: transloco.translate('seo.metaDescription'),
          })),
        );
      },
    }),
  ]);
}
