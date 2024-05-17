import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import { UiArticleCardComponent } from '@angular-love/blog/articles/ui-article-card';
import { BreadcrumbComponent } from '@angular-love/blog/shared/ui-breadcrumb';
import {
  PaginationComponent,
  QueryPaginationDirective,
} from '@angular-love/blog/shared/ui-pagination';

@Component({
  selector: 'al-news',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    UiArticleCardComponent,
    PaginationComponent,
    QueryPaginationDirective,
  ],
  templateUrl: './feature-news.component.html',
  styleUrl: './feature-news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col  h-full w-full',
  },
})
export class FeatureNewsComponent {
  pagination = signal({ take: 12, skip: 0 });

  protected readonly articleStore = inject(ArticleListStore);

  constructor() {
    const query = computed(() => ({
      ...this.pagination(),
      category: 'news' as const,
    }));

    this.articleStore.fetchArticleList(query);
  }
}
