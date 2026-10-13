import { formatDate, isPlatformServer } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  LOCALE_ID,
  makeStateKey,
  PLATFORM_ID,
  signal,
  TransferState,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { AiNewsFeedStore } from '@angular-love/blog/ai-news/data-access';
import {
  DateGroupKey,
  groupByDate,
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

const SERVER_NOW = makeStateKey<number>('ai-news-server-now');

@Component({
  selector: 'al-ai-news-page',
  templateUrl: './ai-news-page.component.html',
  styleUrl: './ai-news-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    RouterLink,
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

  private readonly _locale = inject(LOCALE_ID);
  protected readonly clock = signal<NewsClock>(this.initialClock());
  protected readonly groups = computed(() =>
    groupByDate(
      this.store.items(),
      (item) => new Date(item.publishedAt),
      this.clock(),
    ),
  );

  constructor() {
    this.store.loadFeed(this.selectedCategory);
    // Hydrate with the server's clock, then switch to the reader's time and zone.
    afterNextRender(() => this.clock.set({ now: new Date(), utc: false }));
  }

  protected monthLabel(key: DateGroupKey & { kind: 'month' }): string {
    const label = formatDate(
      new Date(Date.UTC(key.year, key.month - 1, 15)),
      'LLLL yyyy',
      this._locale,
      'UTC',
    );
    // Standalone month names are lowercase in Polish ("wrzesień 2026").
    return label.charAt(0).toLocaleUpperCase(this._locale) + label.slice(1);
  }

  /**
   * Relative dates depend on "now", so the server pins it in TransferState and
   * the client hydrates with the same value (in UTC) to render identical text.
   */
  private initialClock(): NewsClock {
    const transferState = inject(TransferState);
    if (isPlatformServer(inject(PLATFORM_ID))) {
      const now = Date.now();
      transferState.set(SERVER_NOW, now);
      return { now: new Date(now), utc: true };
    }

    const serverNow = transferState.get(SERVER_NOW, null);
    transferState.remove(SERVER_NOW);
    return serverNow === null
      ? { now: new Date(), utc: false }
      : { now: new Date(serverNow), utc: true };
  }
}
