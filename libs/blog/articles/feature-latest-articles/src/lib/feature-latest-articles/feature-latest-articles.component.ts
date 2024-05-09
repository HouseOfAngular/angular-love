import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';

import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui/card';
import { NewsletterComponent } from '@angular-love/newsletter';
import { UiArticleCardComponent } from '@angular-love/ui-article-card';
import { UiArticleListTitleComponent } from '@angular-love/ui-article-list-title';

@Component({
  selector: 'al-feature-latest-articles',
  standalone: true,
  templateUrl: './feature-latest-articles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiArticleListTitleComponent,
    UiArticleCardComponent,
    NewsletterComponent,
    CardComponent,
    GradientCardDirective,
    NgClass,
  ],
  providers: [ArticleListStore],
})
export class FeatureLatestArticlesComponent {
  private readonly _articleListStore = inject(ArticleListStore);

  readonly isFetchArticleListLoading: Signal<boolean> =
    this._articleListStore.isFetchArticleListLoading;

  readonly isFetchArticleListError =
    this._articleListStore.isFetchArticleListError;

  readonly articles = this._articleListStore.articles;

  constructor() {
    this._articleListStore.fetchArticleList({
      // TODO: change to latest when bff is finished
      category: 'news',
      take: 4,
    });
  }
}
