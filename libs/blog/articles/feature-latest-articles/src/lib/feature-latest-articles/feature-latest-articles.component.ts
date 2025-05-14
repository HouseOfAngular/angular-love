import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { AdBannerStore } from '@angular-love/blog/ad-banner/data-access';
import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import {
  ArticleRegularCardSkeletonComponent,
  UiArticleCardComponent,
} from '@angular-love/blog/articles/ui-article-card';
import { NewsletterComponent } from '@angular-love/blog/newsletter';
import { AlNewsletterBannerComponent } from '@angular-love/blog/shared/ad-banner';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';
import {
  CardComponent,
  CardContentDirective,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import { PillDirective } from '@angular-love/blog/shared/ui-pill';
import { ArticleCategory } from '@angular-love/contracts/articles';
import { RepeatDirective } from '@angular-love/utils';

import { CategoryListItem, injectCategories } from './categories.const';

@Component({
  selector: 'al-latest-articles',
  templateUrl: './feature-latest-articles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiArticleCardComponent,
    NewsletterComponent,
    CardComponent,
    NgClass,
    TranslocoDirective,
    ArticleRegularCardSkeletonComponent,
    RepeatDirective,
    CardContentDirective,
    AlNewsletterBannerComponent,
    RouterLink,
    ButtonComponent,
    PillDirective,
    GradientCardDirective,
  ],
  host: {
    'data-testid': 'latest-articles-container',
  },
  providers: [ArticleListStore],
})
export class FeatureLatestArticlesComponent {
  readonly selectedCategorySlug = computed<ArticleCategory | null>(
    () => this.selected().slug,
  );
  readonly categories = injectCategories();
  readonly selected = linkedSignal<CategoryListItem>(
    () => this.categories()[0],
  );

  readonly take = 8;

  private readonly _articleListStore = inject(ArticleListStore);
  private readonly _bannerStore = inject(AdBannerStore);

  // todo: remove this once the card banner is implemented
  protected readonly cardBanner = computed(() => {
    this._bannerStore.banners();
    return {
      url: 'https://img.freepik.com/free-psd/banner-template-black-friday-clearance_23-2148745448.jpg',
      alt: 'Card Banner Example',
      navigateTo: '/',
    };
  });
  readonly isFetchArticleListLoading =
    this._articleListStore.isFetchArticleListLoading;
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
