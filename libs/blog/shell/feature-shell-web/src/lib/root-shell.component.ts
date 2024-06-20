import { NgClass, ViewportScroller } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { LocalizeRouterService } from '@penleychan/ngx-transloco-router';
import { startWith } from 'rxjs';

import { AdBannerStore } from '@angular-love/blog/ad-banner/data-access';
import {
  FooterComponent,
  HeaderComponent,
  LayoutComponent,
} from '@angular-love/blog/layouts/ui-layouts';
import { SearchComponent } from '@angular-love/blog/search/feature-search';
import { AdBannerComponent } from '@angular-love/blog/shared/ad-banner';

@Component({
  selector: 'al-root-shell',
  template: `
    <div class="fixed top-0 z-10 w-full">
      @if (adBannerVisible()) {
        <al-ad-banner
          class="block"
          [data]="adBanner()"
          (closed)="adBannerStore.onClose()"
        />
      }
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
    AdBannerComponent,
    NgClass,
  ],
})
export class RootShellComponent {
  readonly translocoService = inject(TranslocoService);
  readonly localizeRouterService = inject(LocalizeRouterService);

  protected readonly adBannerStore = inject(AdBannerStore);

  protected readonly adBannerVisible = computed(() => {
    //TODO: after data-binding is done we can set this boolean if wp sends banner data
    const data = this.adBannerStore.adBanner;
    return this.adBannerStore.adBannerVisible() && data();
  });

  protected readonly adBanner = computed(() => {
    return this.adBannerStore.adBanner();
  });

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

  constructor(viewport: ViewportScroller) {
    effect(() => {
      this.adBannerVisible()
        ? viewport.setOffset([0, 160])
        : viewport.setOffset([0, 80]);
    });
  }
}
