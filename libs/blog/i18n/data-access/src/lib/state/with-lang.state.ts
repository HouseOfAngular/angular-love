import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { signalStoreFeature, withComputed } from '@ngrx/signals';

export const withLangState = () =>
  signalStoreFeature(
    withComputed((_, translocoService = inject(TranslocoService)) => ({
      lang: toSignal(translocoService.langChanges$, {
        initialValue: translocoService.getActiveLang(),
      }),
    })),
  );
