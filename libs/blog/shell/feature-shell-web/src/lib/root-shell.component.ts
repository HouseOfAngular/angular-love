import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { LocalizeRouterService } from '@penleychan/ngx-transloco-router';
import { startWith } from 'rxjs';

import {
  FooterComponent,
  HeaderComponent,
  LayoutComponent,
} from '@angular-love/blog/layouts/ui-layouts';
import { SearchComponent } from '@angular-love/blog/search/feature-search';

@Component({
  selector: 'al-root-shell',
  template: `
    <al-header
      class="fixed top-0 z-10 block w-full"
      [language]="language()"
      (languageChange)="onLanguageChange($event)"
    >
      <al-search />
    </al-header>
    <al-layout class="mt-20">
      <router-outlet />
    </al-layout>
    <al-footer class="mt-auto block" />
  `,
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    SearchComponent,
  ],
})
export class RootShellComponent {
  readonly translocoService = inject(TranslocoService);
  readonly localizeRouterService = inject(LocalizeRouterService);

  readonly language = toSignal(
    this.translocoService.langChanges$.pipe(
      startWith(this.translocoService.getActiveLang()),
    ),
    {
      initialValue: 'en',
    },
  );

  onLanguageChange(lang: string) {
    this.localizeRouterService.changeLanguage(lang);
  }
}
