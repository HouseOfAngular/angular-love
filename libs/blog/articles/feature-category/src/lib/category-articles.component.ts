import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import {
  ArticleRegularCardSkeletonComponent,
  UiArticleCardComponent,
} from '@angular-love/blog/articles/ui-article-card';
import {
  PageChangeEvent,
  PaginationComponent,
  QueryPaginationDirective,
} from '@angular-love/blog/shared/ui-pagination';
import { ArticleCategory } from '@angular-love/contracts/articles';
import { RepeatDirective } from '@angular-love/utils';

@Component({
  selector: 'al-category-articles',
  imports: [
    PaginationComponent,
    QueryPaginationDirective,
    UiArticleCardComponent,
    ArticleRegularCardSkeletonComponent,
    RepeatDirective,
  ],
  templateUrl: './category-articles.component.html',
  styleUrl: './category-articles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col  h-full w-full',
  },
})
export class CategoryArticlesComponent {
  readonly category = input<ArticleCategory>();
  readonly excludeCategory = input<string>();
  readonly title = input.required<string>();
  readonly id = input.required<string>();

  readonly pagination = signal({ take: 12, skip: 0 });

  protected readonly articleStore = inject(ArticleListStore);

  private readonly _platform = inject(PLATFORM_ID);

  constructor() {
    const query = computed(() => ({
      ...this.pagination(),
      ...(this.category() && { category: this.category() }),
      ...(this.excludeCategory() && {
        excludeCategory: this.excludeCategory(),
      }),
    }));

    this.articleStore.fetchArticleList(query);
  }

  protected pageChange(event: PageChangeEvent) {
    isPlatformBrowser(this._platform) && window.scrollTo(0, 0);
    this.pagination.set(event);
  }
}
