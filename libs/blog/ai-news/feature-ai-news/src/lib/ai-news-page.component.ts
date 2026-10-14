import { DatePipe, TitleCasePipe, ViewportScroller } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationStart,
  Router,
  RouterLink,
  RouterOutlet,
  Scroll,
} from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { AiNewsFeedStore } from '@angular-love/blog/ai-news/data-access';
import {
  DateGroupKey,
  groupByDate,
  NEWS_SITE_TIME_ZONE,
  NewsCardComponent,
  NewsCardSkeletonComponent,
  NewsClock,
} from '@angular-love/blog/ai-news/ui-news-card';
import {
  AI_NEWS_CATEGORIES,
  isAiNewsCategory,
} from '@angular-love/blog/contracts/ai-news';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';
import { RepeatDirective } from '@angular-love/utils';

@Component({
  selector: 'al-ai-news-page',
  templateUrl: './ai-news-page.component.html',
  styleUrl: './ai-news-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    RouterLink,
    RouterOutlet,
    DatePipe,
    TitleCasePipe,
    NewsCardComponent,
    NewsCardSkeletonComponent,
    ButtonComponent,
    RepeatDirective,
  ],
  providers: [AiNewsFeedStore],
  host: { class: 'flex flex-col w-full' },
})
export class AiNewsPageComponent {
  /** `?category=`, bound by the router. Unknown values show everything. */
  readonly category = input<string>();

  protected readonly store = inject(AiNewsFeedStore);
  /** `null` is "All". */
  protected readonly chips = [null, ...AI_NEWS_CATEGORIES] as const;
  protected readonly selectedCategory = computed(() => {
    const category = this.category();
    return isAiNewsCategory(category) ? category : null;
  });

  /**
   * Groups depend on the time zone, so the server renders in the site's zone
   * and the client hydrates in it too (otherwise a card could land in another
   * group and the DOM wouldn't match), then switches to the reader's zone.
   */
  protected readonly clock = signal<NewsClock>({
    now: new Date(),
    timeZone: NEWS_SITE_TIME_ZONE,
  });
  protected readonly groups = computed(() =>
    groupByDate(
      this.store.items(),
      (item) => new Date(item.publishedAt),
      this.clock(),
    ),
  );

  constructor() {
    this.store.loadFeed(this.selectedCategory);
    afterNextRender(() => this.clock.set({ now: new Date() }));
    this.keepScrollAroundPanel();
  }

  /**
   * The router scrolls to the top after every navigation. Opening, closing or
   * switching the item panel shouldn't move the feed behind it, so the
   * position from before the navigation is put back right after. `Scroll`
   * reaches `router.events` before the router's own scroller handles it, so
   * the restore waits for a microtask: after the scroll to the top, before a
   * frame is painted. Leaving the page is unaffected, as this component is
   * gone by then.
   */
  private keepScrollAroundPanel(): void {
    const router = inject(Router);
    const scroller = inject(ViewportScroller);
    let saved: { position: [number, number]; panel: boolean } | null = null;

    router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        saved = {
          position: scroller.getScrollPosition(),
          panel: isPanelUrl(router.url) || isPanelUrl(event.url),
        };
      } else if (event instanceof Scroll && saved?.panel) {
        const { position } = saved;
        queueMicrotask(() =>
          scroller.scrollToPosition(position, { behavior: 'instant' }),
        );
      }
    });
  }

  /** Mid-month in UTC, so any zone formats the same month. */
  protected monthDate(key: DateGroupKey & { kind: 'month' }): Date {
    return new Date(Date.UTC(key.year, key.month - 1, 15));
  }
}

/** `/ai-news/<slug>` or `/pl/ai-news/<slug>`, with any query. */
function isPanelUrl(url: string): boolean {
  return /\/ai-news\/[^/?#]+/.test(url);
}
