import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import {
  ArticleCompactCardSkeletonComponent,
  ArticleRegularCardSkeletonComponent,
  CardType,
  UiArticleCardComponent,
} from '@angular-love/blog/articles/ui-article-card';
import { UiArticleListTitleComponent } from '@angular-love/blog/articles/ui-article-list-title';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';
import { ArticleCategory } from '@angular-love/contracts/articles';

const displayNameDict: Record<ArticleCategory, string> = {
  news: 'homePage.angularNews',
  guides: 'homePage.guides',
  recommended: 'homePage.recommended',
  latest: 'homePage.latest',
  authors: 'homePage.authors',
  'angular-in-depth': 'homePage.angularInDepth',
};

// TODO: Rethink if we need seperated lib for this smart component (usage only for feature-list)
// needed for demo and testing
@Component({
  selector: 'al-category-section-container',
  templateUrl: './category-section-container.component.html',
  styleUrls: ['./category-section-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiArticleCardComponent,
    ButtonComponent,
    RouterLink,
    UiArticleListTitleComponent,
    TranslocoDirective,
    ArticleRegularCardSkeletonComponent,
    ArticleCompactCardSkeletonComponent,
  ],
  host: {
    '[attr.data-testid]': `testId()`,
  },
  providers: [ArticleListStore],
})
export class CategorySectionContainerComponent {
  readonly category = input.required<ArticleCategory>();
  readonly cardType = input<CardType>('regular');
  readonly take = input(6);
  readonly hasCategoryPage = input(true);
  readonly skeleonLoaders = computed(() => [...Array(this.take()).keys()]);

  protected displayName = computed(() => displayNameDict[this.category()]);

  protected testId = computed(() => `category-${this.category()}`);

  protected readonly articleStore = inject(ArticleListStore);

  constructor() {
    const query = computed(() => ({
      category: this.category(),
      take: this.take(),
    }));

    this.articleStore.fetchArticleList(query);
  }
}
