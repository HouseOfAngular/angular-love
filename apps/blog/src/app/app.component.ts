import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppThemeStore } from '@angular-love/data-access-app-theme';

@Component({
  standalone: true,
  selector: 'al-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
})
export class AppComponent {
  private readonly _appThemeStore = inject(AppThemeStore);

  constructor(viewport: ViewportScroller) {
    viewport.setOffset([0, 80]);
    this._appThemeStore.syncWithSystemTheme();

    // Our fonts are self-hosted.
    // https://fonts.google.com/knowledge/using_type/self_hosting_web_fonts
    // We could also preload the fonts that are primarily used, such as
    // Inter Latin and Inter Latin-ext. However, we have multiple unicode-ranges
    // defined, which complicates things. There's no way to define the unicode-range
    // in the `link` media property, for example. Therefore, the font would only be
    // preloaded if the user's browser supports that unicode-range. Nevertheless, we
    // can choose to always preload the Latin subset of the Inter font.
  }

  // Leaving this as commented until the decision is made to always preload the Inter font.
  // ngAfterViewInit(): void {
  //   if (this._isBrowser) return;

  //   const interLatinLink = this._document.createElement('link');
  //   interLatinLink.rel = 'preload';
  //   interLatinLink.href = '/assets/fonts/inter-v13-latin.woff2';
  //   interLatinLink.as = 'font';
  //   interLatinLink.type = 'font/woff2';

  //   this._document.head.appendChild(interLatinLink);
  // }
}
