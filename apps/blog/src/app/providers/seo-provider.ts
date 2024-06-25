import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { map } from 'rxjs';

import { provideSeo } from '@angular-love/seo';
import { convertLangToLocale } from '@angular-love/shared/utils-i18n';

export function provideAppSeo(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideSeo({
      useFactory: () => {
        const transloco = inject(TranslocoService);

        return transloco.load(transloco.getActiveLang()).pipe(
          map(() => ({
            title: 'Angular.love',
            siteName: 'Angular.love',
            locale: convertLangToLocale(transloco.getActiveLang()),
            description: transloco.translate('seo.metaDescription'),
          })),
        );
      },
    }),
  ]);
}
