import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

// Workaround for dynamic locale id
// Source from open github issue: https://github.com/angular/angular/issues/47637
export class LocaleIdProvider {
  translate = inject(TranslocoService);

  get localeStr(): string {
    return this.translate.getActiveLang();
  }

  toLowerCase(): string {
    return this.localeStr.toLowerCase();
  }
}
