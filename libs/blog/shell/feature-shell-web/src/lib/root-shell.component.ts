import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { startWith } from 'rxjs';

import { AdBannerStore } from '@angular-love/blog/ad-banner/data-access';
import { AlLocalizeService } from '@angular-love/blog/i18n/util';
import {
  FooterComponent,
  HeaderComponent,
  LayoutComponent,
} from '@angular-love/blog/layouts/ui-layouts';
import { SearchComponent } from '@angular-love/blog/search/feature-search';
import {
  AdImageBanner,
  AdImageBannerComponent,
  AlBannerCarouselComponent,
} from '@angular-love/blog/shared/ad-banner';

@Component({
  selector: 'al-root-shell',
  template: `
    <div class="sticky top-0 z-10 w-full">
      @if (topBanner(); as topBanner) {
        <al-ad-image-banner
          [banner]="{
            url: topBanner.url!,
            alt: topBanner.alt!,
            action: {
              type: 'url',
              url: topBanner.navigateTo!,
            },
          }"
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
    <al-layout>
      @if (slides(); as slides) {
        <al-banner-carousel [banners]="slides" [msPerSlide]="msPerSlide()!" />
      }
      <router-outlet />
    </al-layout>
    <al-footer class="mt-auto block" />
  `,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    SearchComponent,
    NgClass,
    AlBannerCarouselComponent,
    AdImageBannerComponent,
  ],
})
export class RootShellComponent {
  protected readonly bannerStore = inject(AdBannerStore);
  protected readonly slides = computed<AdImageBanner[] | undefined>(() =>
    this.bannerStore.banners()?.slider?.slides.map((slide) => ({
      url: slide.url!,
      alt: slide.alt!,
      action: {
        type: 'url',
        url: slide.navigateTo,
      },
    })),
  );
  protected readonly msPerSlide = computed(
    () => this.bannerStore.banners()?.slider?.slideDisplayTimeMs,
  );
  protected readonly topBanner = computed(
    () => this.bannerStore.banners()?.topBanner,
  );

  readonly translocoService = inject(TranslocoService);

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

  constructor() {
    this.bannerStore.getData();
  }
}
