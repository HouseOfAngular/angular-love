import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import {
  ArticleRegularCardSkeletonComponent,
  UiArticleCardComponent,
} from '@angular-love/blog/articles/ui-article-card';
import { NewsletterComponent } from '@angular-love/blog/newsletter';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';
import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import { PillDirective } from '@angular-love/blog/shared/ui-pill';
import { ArticleCategory } from '@angular-love/contracts/articles';
import { RepeatDirective } from '@angular-love/utils';

import { CATEGORIES_LIST, CategoryListItem } from './categories.const';

@Component({
  selector: 'al-latest-articles',
  templateUrl: './feature-latest-articles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiArticleCardComponent,
    NewsletterComponent,
    CardComponent,
    GradientCardDirective,
    NgClass,
    TranslocoDirective,
    ArticleRegularCardSkeletonComponent,
    CardComponent,
    RepeatDirective,
    RouterLink,
    ButtonComponent,
    PillDirective,
  ],
  host: {
    'data-testid': 'latest-articles-container',
  },
  providers: [ArticleListStore],
})
export class FeatureLatestArticlesComponent {
  readonly selected = signal<CategoryListItem>(CATEGORIES_LIST[0]);
  readonly selectedCategorySlug = computed<ArticleCategory | null>(
    () => this.selected().slug,
  );
  readonly categories = CATEGORIES_LIST;
  readonly take = 8;

  private readonly _articleListStore = inject(ArticleListStore);

  readonly isFetchArticleListLoading =
    this._articleListStore.isFetchArticleListLoading;

  readonly isFetchArticleListError =
    this._articleListStore.isFetchArticleListError;

  readonly articles = this._articleListStore.articles;

  constructor() {
    const query = computed(() => {
      const selectedCategorySlug = this.selectedCategorySlug();
      return {
        take: this.take,
        ...(selectedCategorySlug && { category: selectedCategorySlug }),
      };
    });

    this._articleListStore.fetchArticleList(query);
  }
}
