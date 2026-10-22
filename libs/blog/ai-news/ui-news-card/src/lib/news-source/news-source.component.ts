import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { AiNewsItem } from '@angular-love/blog/contracts/ai-news';

import { sourceIcon } from '../source-icon';

/** The source's icon and "Post on X by @author", as on the card. */
@Component({
  selector: 'al-news-source',
  template: `
    @let news = item();
    <fast-svg
      aria-hidden="true"
      class="mt-0.5 shrink-0"
      [name]="icon()"
      size="16"
    />
    @let label =
      'aiNewsPage.card.label.' + news.sourceType
        | transloco: { source: news.sourceName };
    @let byAuthor =
      news.author
        ? ('aiNewsPage.card.byAuthor' | transloco: { author: news.author })
        : '';
    <span data-testid="news-card-source" class="line-clamp-2 min-w-0">
      {{ byAuthor ? label + ' ' + byAuthor : label }}
    </span>
  `,
  imports: [FastSvgComponent, TranslocoPipe],
  // The svg is sized here: fast-svg only sets its width and height after
  // rendering, and an unsized svg is 300×150 until then.
  host: { class: 'flex items-start gap-2 [&_svg]:size-4 [&_svg]:shrink-0' },
})
export class NewsSourceComponent {
  readonly item =
    input.required<
      Pick<AiNewsItem, 'url' | 'sourceType' | 'sourceName' | 'author'>
    >();

  protected readonly icon = computed(() =>
    sourceIcon(this.item().url, this.item().sourceType),
  );
}
