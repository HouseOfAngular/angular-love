import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import { UiArticleCardComponent } from '@angular-love/blog/articles/ui-article-card';
import { AuthorDetailsStore } from '@angular-love/blog/authors/data-access';
import {
  AuthorCardComponent,
  AuthorCardSkeletonComponent,
} from '@angular-love/blog/authors/ui-author-card';
import { BreadcrumbComponent } from '@angular-love/blog/shared/ui-breadcrumb';
import {
  PaginationComponent,
  QueryPaginationDirective,
} from '@angular-love/blog/shared/ui-pagination';
import { RepeatDirective } from '@angular-love/utils';

@Component({
  selector: 'al-author',
  standalone: true,
  imports: [
    AuthorCardComponent,
    AuthorCardSkeletonComponent,
    RepeatDirective,
    BreadcrumbComponent,
    UiArticleCardComponent,
    PaginationComponent,
    QueryPaginationDirective,
    TranslocoDirective,
  ],
  templateUrl: './feature-author.component.html',
  styleUrl: './feature-author.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col h-full w-full',
  },
})
export class FeatureAuthorComponent {
  readonly pageSize = 12;

  readonly authorSlug = input.required<string>();

  readonly pagination = signal({ skip: 0, take: this.pageSize });

  protected readonly articleStore = inject(ArticleListStore);
  protected readonly authorDetailsStore = inject(AuthorDetailsStore);

  readonly authorName = computed(
    () => this.authorDetailsStore.authorDetails()?.name ?? '',
  );

  constructor() {
    const fetchArticlesQuery = computed(() => ({
      ...this.pagination(),
      authorSlug: this.authorSlug(),
    }));

    this.articleStore.fetchArticleList(fetchArticlesQuery);
    this.authorDetailsStore.fetchAuthorDetails(this.authorSlug);
  }
}
