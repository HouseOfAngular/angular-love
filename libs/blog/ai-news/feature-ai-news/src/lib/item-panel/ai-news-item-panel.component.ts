import { CdkTrapFocus } from '@angular/cdk/a11y';
import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  LOCALE_ID,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import {
  AiNewsFeedStore,
  AiNewsItemStore,
} from '@angular-love/blog/ai-news/data-access';
import {
  formatNewsDate,
  NEWS_SITE_TIME_ZONE,
  NewsClock,
  NewsSourceComponent,
} from '@angular-love/blog/ai-news/ui-news-card';
import {
  AiNewsItem,
  parseAiNewsSummary,
} from '@angular-love/blog/contracts/ai-news';
import { AlLocalizeService } from '@angular-love/blog/i18n/util';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';

/**
 * `/ai-news/:slug`: the item's full summary in a panel over the feed. It is a
 * child route of the feed, so the list stays rendered behind it, and the URL
 * can be shared and counts as a page view. Closing goes back to the feed with
 * the same filter.
 */
@Component({
  selector: 'al-ai-news-item-panel',
  templateUrl: './ai-news-item-panel.component.html',
  styleUrl: './ai-news-item-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    CdkTrapFocus,
    FastSvgComponent,
    NewsSourceComponent,
    ButtonComponent,
  ],
  providers: [AiNewsItemStore],
  host: {
    '[class.animate-open]': 'animateOpen',
    '(document:keydown.escape)': 'close()',
  },
})
export class AiNewsItemPanelComponent {
  /** The `:slug` route param. */
  readonly slug = input.required<string>();

  protected readonly store = inject(AiNewsItemStore);
  private readonly _feed = inject(AiNewsFeedStore, { optional: true });
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _locale = inject(LOCALE_ID);
  private readonly _document = inject(DOCUMENT);
  private readonly _localize = inject(AlLocalizeService);
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _body = viewChild<ElementRef<HTMLElement>>('body');
  private readonly _heading = viewChild<ElementRef<HTMLElement>>('heading');

  /** The full item, or the feed's copy of it while the summary loads. */
  protected readonly item = computed<AiNewsItem | null>(
    () =>
      this.store.item() ??
      this._feed?.items().find(({ slug }) => slug === this.slug()) ??
      null,
  );
  protected readonly summary = computed(() => {
    const item = this.store.item();
    return item ? parseAiNewsSummary(item.summary) : null;
  });

  /**
   * Slides in when opened from the feed, but not when the page is loaded with
   * the panel already open. Hydration reuses the server's element, which is
   * already in the document; a panel opened from the feed isn't attached yet.
   */
  protected readonly animateOpen =
    this._isBrowser &&
    !inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.isConnected;
  /** Plays the closing slide, then navigates back (see `onAnimationEnd`). */
  protected readonly closing = signal(false);
  protected readonly copied = signal(false);
  private _copiedTimer?: ReturnType<typeof setTimeout>;

  /** Same as the feed: the site's time zone until hydrated, then the reader's. */
  private readonly _clock = signal<NewsClock>({
    now: new Date(),
    timeZone: NEWS_SITE_TIME_ZONE,
  });
  protected readonly date = computed(() => {
    const item = this.item();
    return item
      ? formatNewsDate(
          new Date(item.publishedAt),
          this._clock(),
          this._locale,
          {
            dateStyle: 'long',
            timeStyle: 'short',
          },
        )
      : '';
  });

  constructor() {
    this.store.loadItem(this.slug);

    // Every item starts at the top, with focus on its title (once it
    // renders). Browser only: the server has no scrolling or focus.
    afterRenderEffect(() => {
      this.slug();
      const heading = this._heading();
      untracked(() => {
        this._body()?.nativeElement.scrollTo({ top: 0 });
        heading?.nativeElement.focus({ preventScroll: true });
      });
    });

    const root = this._document.documentElement;
    afterNextRender(() => {
      this._clock.set({ now: new Date() });
      root.classList.add('overflow-hidden');
    });
    inject(DestroyRef).onDestroy(() => {
      // The server destroys the app after every render: nothing to undo there.
      if (!this._isBrowser) {
        return;
      }
      clearTimeout(this._copiedTimer);
      root.classList.remove('overflow-hidden');
      // Back on the card that opened it, or the last one shown.
      this._document
        .querySelector<HTMLElement>(
          `[data-ai-news-slug="${CSS.escape(this.slug())}"] a`,
        )
        ?.focus({ preventScroll: true });
    });
  }

  close(): void {
    if (this.closing()) {
      return;
    }
    const reducedMotion = this._document.defaultView?.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reducedMotion) {
      this.navigateBack();
    } else {
      this.closing.set(true);
    }
  }

  protected onAnimationEnd(event: AnimationEvent): void {
    if (this.closing() && event.target === event.currentTarget) {
      this.navigateBack();
    }
  }

  /**
   * The system share sheet on phones and tablets, a copied link elsewhere
   * (desktop share sheets rarely have the apps people send links with).
   */
  protected async share(item: AiNewsItem): Promise<void> {
    const window = this._document.defaultView;
    if (!window) {
      return;
    }
    const url = new URL(
      this._localize.localizePath(`/ai-news/${item.slug}`),
      window.location.origin,
    ).href;

    if (
      window.navigator.share &&
      window.matchMedia('(pointer: coarse)').matches
    ) {
      try {
        await window.navigator.share({ title: item.title, url });
      } catch {
        // Dismissed, nothing to do.
      }
      return;
    }

    await window.navigator.clipboard.writeText(url);
    this.copied.set(true);
    clearTimeout(this._copiedTimer);
    this._copiedTimer = setTimeout(() => this.copied.set(false), 3000);
  }

  private navigateBack(): void {
    this._router.navigate(['..'], {
      relativeTo: this._route,
      queryParamsHandling: 'preserve',
    });
  }
}
