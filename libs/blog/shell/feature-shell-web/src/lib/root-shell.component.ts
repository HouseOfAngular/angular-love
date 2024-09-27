import { NgClass, ViewportScroller } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { startWith } from 'rxjs';

import { AlLocalizeService } from '@angular-love/blog/i18n/util';
import {
  FooterComponent,
  HeaderComponent,
  LayoutComponent,
} from '@angular-love/blog/layouts/ui-layouts';
import { SearchComponent } from '@angular-love/blog/search/feature-search';

@Component({
  selector: 'al-root-shell',
  template: `
    <div class="fixed top-0 z-10 w-full">
      <!--top screen closable banner-->
      <!--@if (adBannerVisible()) {
        <al-ad-banner
          class="block"
          [data]="adBanner()"
          (closed)="adBannerStore.onClose()"
        />
      }-->
      <al-header
        class="block w-full"
        [language]="language()"
        (languageChange)="onLanguageChange($event)"
      >
        <al-search />
      </al-header>
    </div>
    <al-layout class="mt-20" [ngClass]="{ 'mt-40': adBannerVisible() }">
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
    NgClass,
  ],
})
export class RootShellComponent {
  readonly translocoService = inject(TranslocoService);

  // todo: temporary solution to keep in mind how banner influence the layout
  protected readonly adBannerVisible = computed(() => false);

  readonly language = toSignal(
    this.translocoService.langChanges$.pipe(
      startWith(this.translocoService.getActiveLang()),
    ),
    {
      initialValue: 'en',
    },
  );

  private readonly _router = inject(Router);
  private readonly _localizeService = inject(AlLocalizeService);

  onLanguageChange(lang: string) {
    this._router.navigateByUrl(
      this._localizeService.localizeExplicitPath(this._router.url, lang),
    );
  }

  constructor(viewport: ViewportScroller) {
    // todo: temporary solution to keep in mind how banner influence the layout
    effect(() => {
      this.adBannerVisible()
        ? viewport.setOffset([0, 160])
        : viewport.setOffset([0, 80]);
    });
  }
}
