import { ViewportScroller } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { startWith } from 'rxjs';

import { AdBannerStore } from '@angular-love/blog/ad-banner/data-access';
import { AlLocalizeService } from '@angular-love/blog/i18n/util';
import {
  FooterComponent,
  HeaderComponent,
} from '@angular-love/blog/layouts/ui-layouts';
import { FeatureRoadmapComponent } from '@angular-love/blog/roadmap/feature-roadmap';
import { SearchComponent } from '@angular-love/blog/search/feature-search';
import { AdImageBanner } from '@angular-love/blog/shared/ad-banner';

@Component({
  selector: 'al-root-shell',
  template: `
    <al-header
      class="block w-full"
      [language]="language()"
      (languageChange)="onLanguageChange($event)"
    >
      <al-search />
    </al-header>
    <al-feature-roadmap class="flex-1 basis-0" />
    <al-footer />
  `,
  imports: [
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    FeatureRoadmapComponent,
  ],
  host: {
    class: 'flex flex-col min-h-screen',
  },
})
export class RoadmapShellComponent {
  protected readonly sliderStore = inject(AdBannerStore);
  protected readonly slides = computed<AdImageBanner[] | undefined>(() =>
    this.sliderStore.slider()?.slides.map((slide) => ({
      url: slide.url,
      alt: slide.alt,
      action: {
        type: 'url',
        url: slide.navigateTo,
      },
    })),
  );
  protected readonly msPerSlide = computed(
    () => this.sliderStore.slider()?.slideDisplayTimeMs,
  );

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
    this.sliderStore.getData();
  }
}
