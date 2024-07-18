import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

import { PixelFactory, ScriptFactory, ScriptsLoader } from './scripts-loader';

@Injectable()
export class ScriptsLoaderService implements ScriptsLoader {
  private readonly _document = inject(DOCUMENT);

  init(scripts: ScriptFactory[], pixels: PixelFactory[]): void {
    scripts.forEach((script) => {
      const scriptElement = this._document.createElement('script');
      const _script = script(scriptElement);
      this._document.head.appendChild(_script);
    });

    pixels.forEach((pixel) => {
      const noScriptElement = this._document.createElement('noscript');
      const pixelElement = this._document.createElement('img');
      const _pixel = pixel(pixelElement);
      noScriptElement.append(_pixel);
      this._document.head.appendChild(noScriptElement);
    });
  }
}
