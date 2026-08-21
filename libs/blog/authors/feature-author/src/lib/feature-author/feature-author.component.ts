import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { ArticleRegularCardComponent } from '@angular-love/blog/articles/ui-article-card';
import { AuthorDetailsStore } from '@angular-love/blog/authors/data-access';
import {
  AuthorCardComponent,
  AuthorCardSkeletonComponent,
} from '@angular-love/blog/authors/ui-author-card';
import { NotFoundPageComponent } from '@angular-love/blog/shared/ui-not-found';
import {
  PaginationComponent,
  QueryPaginationDirective,
} from '@angular-love/blog/shared/ui-pagination';

@Component({
  selector: 'al-author',
  imports: [
    AuthorCardComponent,
    AuthorCardSkeletonComponent,
    ArticleRegularCardComponent,
    PaginationComponent,
    QueryPaginationDirective,
    TranslocoDirective,
    NotFoundPageComponent,
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

  protected readonly authorDetailsStore = inject(AuthorDetailsStore);

  readonly authorName = computed(
    () => this.authorDetailsStore.authorDetails()?.name ?? '',
  );

  constructor() {
    const fetchArticlesQuery = computed(() => ({
      query: this.pagination(),
      slug: this.authorSlug(),
    }));

    this.authorDetailsStore.fetchArticleList(fetchArticlesQuery);
  }
}
