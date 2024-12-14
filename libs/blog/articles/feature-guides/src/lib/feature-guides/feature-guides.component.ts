import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  selector: 'al-guides',
  imports: [
    PaginationComponent,
    QueryPaginationDirective,
    UiArticleCardComponent,
    ArticleRegularCardSkeletonComponent,
    RepeatDirective,
  ],
  templateUrl: './feature-guides.component.html',
  styleUrl: './feature-guides.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col  h-full w-full',
  },
})
export class FeatureGuidesComponent {
  pagination = signal({ take: 12, skip: 0 });

  protected readonly articleStore = inject(ArticleListStore);

  constructor() {
    const query = computed(() => ({
      ...this.pagination(),
      category: 'guides' as const,
    }));

    this.articleStore.fetchArticleList(query);
  }
  protected pageChange(event: PageChangeEvent) {
    window.scrollTo(0, 0);
    this.pagination.set(event);
  }
}
