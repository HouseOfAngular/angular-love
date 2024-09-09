import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  inject,
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
import { RepeatDirective } from '@angular-love/utils';

@Component({
  selector: 'al-latest',
  standalone: true,
  imports: [
    UiArticleCardComponent,
    PaginationComponent,
    QueryPaginationDirective,
    ArticleRegularCardSkeletonComponent,
    RepeatDirective,
  ],
  templateUrl: './latest-articles-page.component.html',
  styleUrl: './latest-articles-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureLatestArticlesPageComponent {
  @HostBinding('class') hostClasses = 'flex flex-col  h-full w-full';

  pagination = signal({ take: 12, skip: 0 });

  protected readonly articleStore = inject(ArticleListStore);

  constructor() {
    const query = computed(() => ({
      ...this.pagination(),
      excludeCategory: 'angular-in-depth-en',
    }));

    this.articleStore.fetchArticleList(query);
  }

  protected pageChange(event: PageChangeEvent) {
    window.scrollTo(0, 0);
    this.pagination.set(event);
  }
}
