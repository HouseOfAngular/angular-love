import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import {
  ArticleRegularCardSkeletonComponent,
  UiArticleCardComponent,
} from '@angular-love/blog/articles/ui-article-card';
import { UiArticleListTitleComponent } from '@angular-love/blog/articles/ui-article-list-title';
import { NewsletterComponent } from '@angular-love/blog/newsletter';
import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import { RepeatDirective } from '@angular-love/utils';

@Component({
  selector: 'al-latest-articles',
  templateUrl: './feature-latest-articles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiArticleListTitleComponent,
    UiArticleCardComponent,
    NewsletterComponent,
    CardComponent,
    GradientCardDirective,
    NgClass,
    TranslocoDirective,
    ArticleRegularCardSkeletonComponent,
    CardComponent,
    RepeatDirective,
  ],
  host: {
    'data-testid': 'latest-articles-container',
  },
  providers: [ArticleListStore],
})
export class FeatureLatestArticlesComponent {
  private readonly _articleListStore = inject(ArticleListStore);

  readonly isFetchArticleListLoading =
    this._articleListStore.isFetchArticleListLoading;

  readonly isFetchArticleListError =
    this._articleListStore.isFetchArticleListError;

  readonly articles = this._articleListStore.articles;

  constructor() {
    this._articleListStore.fetchArticleList({
      take: 5,
      excludeCategory: 'angular-in-depth-en',
    });
  }
}
