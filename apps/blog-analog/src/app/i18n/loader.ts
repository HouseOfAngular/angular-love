import { inject, Injectable, makeStateKey, TransferState } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { from, of, tap } from 'rxjs';

const loaders = import.meta.glob('./assets/*.json', {
  import: 'default',
}) as Record<string, () => Promise<Translation>>;

@Injectable({ providedIn: 'root' })
export class TranslocoAnalogLoader implements TranslocoLoader {
  private _transferState = inject(TransferState);

  getTranslation(lang: string) {
    const stateKey = makeStateKey<Translation>(`transloco-${lang}`);
    const cachedTranslation = this._transferState.get(stateKey, null);

    if (cachedTranslation) {
      return of(cachedTranslation);
    }

    const loadChunk = loaders[`./assets/${lang}.json`];

    return from(loadChunk()).pipe(
      tap((translation) => {
        this._transferState.set(stateKey, translation);
      }),
    );
  }
}
