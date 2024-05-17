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
  selector: 'al-guides',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    PaginationComponent,
    QueryPaginationDirective,
    UiArticleCardComponent,
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
}
