import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import * as v from 'valibot';

import { Lang, LangSchema } from '@angular-love/contracts/articles';

@Injectable()
export class AlI18nService {
  private readonly _transloco = inject(TranslocoService);

  getActiveLang(): Lang {
    const activeLang = this._transloco.getActiveLang();
    const result = v.safeParse(LangSchema, activeLang);

    if (!result.success) {
      console.warn(
        `Invalid active language "${activeLang}", defaulting to "en".`,
      );
      return 'en';
    }

    return result.output;
  }
}
