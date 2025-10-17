import { ViewportScroller } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { filter, map, startWith, switchMap } from 'rxjs';

import { AdBannerStore } from '@angular-love/blog/ad-banner/data-access';
import { AlLocalizeService } from '@angular-love/blog/i18n/util';
import {
  FooterComponent,
  HeaderComponent,
  LayoutComponent,
  LayoutConfig,
} from '@angular-love/blog/layouts/ui-layouts';
import { SearchComponent } from '@angular-love/blog/search/feature-search';
import {
  AdImageBanner,
  AlBannerCarouselComponent,
} from '@angular-love/blog/shared/ad-banner';
import { AppThemeStore } from '@angular-love/data-access-app-theme';

const FOOTERLESS_ROUTES = ['roadmap'];

@Component({
  selector: 'al-root-shell',
  template: `
    <!--    <al-top-banner #topBanner />-->
    <div class="sticky top-0 z-10 w-full">
      <al-header
        class="block w-full"
        [language]="language()"
        [theme]="theme()"
        (languageChange)="onLanguageChange($event)"
        (themeToggle)="onThemeToggle()"
      >
        <al-search />
      </al-header>
    </div>
    <al-layout
      class="mt-0"
      [class.mt-20]="adBannerVisible()"
      [layoutConfig]="layoutConfig()"
    >
      @if (slides()?.length && slides(); as slides) {
        <al-banner-carousel
          class="mb-4 inline-block"
          [banners]="slides"
          [class]="layoutConfig() ? 'hidden' : ''"
          [msPerSlide]="msPerSlide()!"
        />
      }
      <router-outlet />
    </al-layout>
    @if (!hideFooter()) {
      <al-footer class="mt-auto block" [theme]="theme()" />
    }
  `,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    SearchComponent,
    AlBannerCarouselComponent,
  ],
  host: {
    class: 'flex flex-col min-h-screen',
  },
})
export class RootShellComponent {
  private readonly _router = inject(Router);
  private readonly _localizeService = inject(AlLocalizeService);
  private readonly _activatedRoute = inject(ActivatedRoute);

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
  private readonly _appThemeStore = inject(AppThemeStore);

  protected readonly theme = computed(() => this._appThemeStore.theme());
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
  readonly layoutConfig = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this._activatedRoute),
      map((route) => route.firstChild),
      filter(Boolean),
      switchMap((route) => route?.data),
      map((data) => data?.['layoutConfig'] as LayoutConfig | undefined),
    ),
  );

  readonly hideFooter = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this._router.url),
      map((url) =>
        FOOTERLESS_ROUTES.some((route) => url.includes(`/${route}`)),
      ),
    ),
  );

  onLanguageChange(lang: string) {
    this._router.navigateByUrl(
      this._localizeService.localizeExplicitPath(this._router.url, lang),
    );
  }

  onThemeToggle() {
    this._appThemeStore.toggleTheme();
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
