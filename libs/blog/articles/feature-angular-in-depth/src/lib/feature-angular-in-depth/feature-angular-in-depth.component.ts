import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import {
  ArticleCompactCardSkeletonComponent,
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
  selector: 'al-angular-in-depth',
  imports: [
    PaginationComponent,
    QueryPaginationDirective,
    UiArticleCardComponent,
    ArticleCompactCardSkeletonComponent,
    ArticleRegularCardSkeletonComponent,
    RepeatDirective,
  ],
  templateUrl: './feature-angular-in-depth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col  h-full w-full',
  },
})
export class FeatureAngularInDepthComponent {
  pagination = signal({ take: 12, skip: 0 });

  protected readonly articleStore = inject(ArticleListStore);

  constructor() {
    const query = computed(() => ({
      ...this.pagination(),
      category: 'angular-in-depth' as const,
    }));

    this.articleStore.fetchArticleList(query);
  }
  protected pageChange(event: PageChangeEvent) {
    window.scrollTo(0, 0);
    this.pagination.set(event);
  }
}
