import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  LOCALE_ID,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { AiNewsItem } from '@angular-love/blog/contracts/ai-news';

import { dateGroup, formatNewsDate, NewsClock } from '../news-dates';
import { sourceIcon } from '../source-icon';

/**
 * One feed item, linking out to the source. Thumbnails are off for now: the
 * API still returns `thumbnailUrl`, the card doesn't render it.
 */
@Component({
  selector: 'al-news-card',
  templateUrl: './news-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FastSvgComponent, TranslocoPipe],
  host: {
    class: 'block',
    'data-testid': 'news-card',
  },
})
export class NewsCardComponent {
  readonly item = input.required<AiNewsItem>();
  readonly clock = input.required<NewsClock>();

  private readonly _locale = inject(LOCALE_ID);

  protected readonly icon = computed(() =>
    sourceIcon(this.item().url, this.item().sourceType),
  );

  private readonly _publishedAt = computed(
    () => new Date(this.item().publishedAt),
  );
  /**
   * The page already groups cards by day, so today and yesterday show the
   * time, older items the date.
   */
  protected readonly dateText = computed(() => {
    const { kind } = dateGroup(this._publishedAt(), this.clock());
    return kind === 'today' || kind === 'yesterday'
      ? this.format({ hour: 'numeric', minute: '2-digit' })
      : this.format({ month: 'short', day: 'numeric' });
  });
  protected readonly absoluteDate = computed(() =>
    this.format({ dateStyle: 'medium', timeStyle: 'short' }),
  );

  private format(options: Intl.DateTimeFormatOptions): string {
    return formatNewsDate(
      this._publishedAt(),
      this.clock(),
      this._locale,
      options,
    );
  }
}
