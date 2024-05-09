import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import { ButtonComponent } from '@angular-love/blog/shared/ui/button';
import { ArticleCategory } from '@angular-love/contracts/articles';
import { UiArticleCardComponent } from '@angular-love/ui-article-card';

const displayNameDict: Record<ArticleCategory, string> = {
  news: 'Angular News',
  guides: 'Angular Guides',
};

// TODO: Rethink if we need seperated lib for this smart component (usage only for feature-list)
// needed for demo and testing
@Component({
  standalone: true,
  selector: 'al-category-section-container',
  templateUrl: './category-section-container.component.html',
  styleUrls: ['./category-section-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiArticleCardComponent, ButtonComponent, RouterLink],
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
    }));

    this.articleStore.fetchArticleList(query);
  }
}
