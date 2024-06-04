import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
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
  templateUrl: './recommended-articles.component.html',
  styleUrl: './recommended-articles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureRecommendedArticlesPageComponent {
  @HostBinding('class') hostClasses = 'flex flex-col  h-full w-full';

  pagination = signal({ take: 12, skip: 0 });

  protected readonly articleStore = inject(ArticleListStore);

  constructor() {
    const query = computed(() => ({
      ...this.pagination(),
      category: 'recommended' as const,
    }));

    this.articleStore.fetchArticleList(query);
  }
}