import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import { UiArticleCardComponent } from '@angular-love/blog/articles/ui-article-card';
import { UiArticleListTitleComponent } from '@angular-love/blog/articles/ui-article-list-title';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';
import { ArticleCategory } from '@angular-love/contracts/articles';

const displayNameDict: Record<ArticleCategory, string> = {
  news: 'Angular News',
  guides: 'Angular Guides',
  recommended: 'Recommended Articles',
  latest: 'Latest Articles',
  authors: 'Authors',
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
  ],
  providers: [ArticleListStore],
})
export class CategorySectionContainerComponent {
  category = input.required<ArticleCategory>();
  take = input(6);

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
