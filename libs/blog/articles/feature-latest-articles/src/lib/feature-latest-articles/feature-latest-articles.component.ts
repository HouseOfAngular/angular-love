import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { AdBannerStore } from '@angular-love/blog/ad-banner/data-access';
import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import {
  ArticleRegularCardSkeletonComponent,
  UiArticleCardComponent,
} from '@angular-love/blog/articles/ui-article-card';
import { UiArticleListTitleComponent } from '@angular-love/blog/articles/ui-article-list-title';
import { NewsletterComponent } from '@angular-love/blog/newsletter';
import { AlNewsletterBannerComponent } from '@angular-love/blog/shared/ad-banner';
import {
  CardComponent,
  CardContentDirective,
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
    NgClass,
    TranslocoDirective,
    ArticleRegularCardSkeletonComponent,
    RepeatDirective,
    CardContentDirective,
    AlNewsletterBannerComponent,
  ],
  host: {
    'data-testid': 'latest-articles-container',
  },
  providers: [ArticleListStore],
})
export class FeatureLatestArticlesComponent {
  private readonly _articleListStore = inject(ArticleListStore);
  private readonly _bannerStore = inject(AdBannerStore);
  protected readonly cardBanner = computed(
    () => this._bannerStore.banners()?.cardBanner,
  );
  readonly isFetchArticleListLoading =
    this._articleListStore.isFetchArticleListLoading;
  readonly articles = this._articleListStore.articles;

  constructor() {
    this._articleListStore.fetchArticleList({
      take: 5,
      excludeCategory: 'angular-in-depth-en',
    });
  }
}
