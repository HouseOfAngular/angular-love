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
    }));

    this.articleStore.fetchArticleList(query);
  }
}
