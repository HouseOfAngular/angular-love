import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';

import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import {
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
};

// TODO: Rethink if we need seperated lib for this smart component (usage only for feature-list)
// needed for demo and testing
@Component({
  standalone: true,
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
  ],
  providers: [ArticleListStore],
})
export class CategorySectionContainerComponent {
  category = input.required<ArticleCategory>();
  cardType = input<CardType>('regular');
  take = input(6);
  hasCategoryPage = input(true);

  displayName = computed(() => displayNameDict[this.category()]);

  protected readonly articleStore = inject(ArticleListStore);

  constructor() {
    const query = computed(() => ({
      category: this.category(),
      take: this.take(),
      excludeRecent: 5,
    }));

    this.articleStore.fetchArticleList(query);
  }
}
