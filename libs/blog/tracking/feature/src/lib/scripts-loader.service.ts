import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

import { ScriptFactory, ScriptsLoader } from './scripts-loader';

@Injectable()
export class ScriptsLoaderService implements ScriptsLoader {
  private readonly _document = inject(DOCUMENT);

  init(scripts: ScriptFactory[]): void {
    scripts.forEach((script) => {
      const scriptElement = this._document.createElement('script');
      const _script = script(scriptElement);
      this._document.head.appendChild(_script);
    });
  }
}
