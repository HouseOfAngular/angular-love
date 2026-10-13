import { formatDate } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  LOCALE_ID,
  signal,
  viewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import {
  AiNewsItem,
  getYouTubeVideoId,
} from '@angular-love/blog/contracts/ai-news';

import { dateGroup, NewsClock, relativeTime } from '../news-dates';
import { sourceIcon } from '../source-icon';

const YOUTUBE_PLACEHOLDER_WIDTH = 120;

/**
 * One feed item, linking out to the source. Items without a thumbnail
 * (social posts, papers…) render the same card without the image slot.
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
  private readonly _image =
    viewChild<ElementRef<HTMLImageElement>>('thumbnail');
  private readonly _imageFailed = signal(false);

  protected readonly thumbnailUrl = computed(() =>
    this._imageFailed() ? null : this.item().thumbnailUrl,
  );
  protected readonly isVideo = computed(
    () => getYouTubeVideoId(this.item().url) !== null,
  );
  protected readonly icon = computed(() =>
    sourceIcon(this.item().url, this.item().sourceType),
  );

  private readonly _publishedAt = computed(
    () => new Date(this.item().publishedAt),
  );
  protected readonly relative = computed(() =>
    relativeTime(this._publishedAt(), this.clock().now),
  );
  /**
   * The page already groups cards by day, so the card adds what the heading
   * doesn't say: how long ago (today, `null` here), the time (yesterday), else
   * the date.
   */
  protected readonly dateText = computed((): string | null => {
    switch (dateGroup(this._publishedAt(), this.clock()).kind) {
      case 'today':
        return null;
      case 'yesterday':
        return this.format('shortTime');
      default:
        return this.dayAndMonth();
    }
  });
  protected readonly absoluteDate = computed(() => this.format('medium'));

  constructor() {
    // An image that settled before hydration never reached our listeners.
    afterNextRender(() => {
      const image = this._image()?.nativeElement;
      if (image?.complete) {
        this.onImageLoad(image);
      }
    });
  }

  protected onImageError(): void {
    this._imageFailed.set(true);
  }

  protected onImageLoad(image: HTMLImageElement): void {
    // A missing YouTube video still "loads": a 404 with a 120x90 grey
    // placeholder, where a real hqdefault frame is 480x360.
    const isPlaceholder =
      this.isVideo() && image.naturalWidth <= YOUTUBE_PLACEHOLDER_WIDTH;
    if (image.naturalWidth === 0 || isPlaceholder) {
      this._imageFailed.set(true);
    }
  }

  /** "Oct 11" / "11 paź": Angular has no locale-aware day-and-month format. */
  private dayAndMonth(): string {
    return new Intl.DateTimeFormat(this._locale, {
      month: 'short',
      day: 'numeric',
      timeZone: this.clock().utc ? 'UTC' : undefined,
    }).format(this._publishedAt());
  }

  private format(format: string): string {
    return formatDate(
      this._publishedAt(),
      format,
      this._locale,
      this.clock().utc ? 'UTC' : undefined,
    );
  }
}
