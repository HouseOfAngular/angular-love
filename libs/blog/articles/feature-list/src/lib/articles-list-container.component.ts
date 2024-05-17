import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';

import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import { ArticlePreview } from '@angular-love/contracts/articles';
import { RepeatDirective } from '@angular-love/utils';

import { CategorySectionContainerComponent } from './category-section-container/category-section-container.component';

@Component({
  selector: 'al-articles-list',
  templateUrl: './articles-list-container.component.html',
  imports: [
    RepeatDirective,
    AsyncPipe,
    JsonPipe,
    CategorySectionContainerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ArticlesListContainerComponent {
  private readonly _articleListStore = inject(ArticleListStore);

  readonly isFetchArticleListLoading: Signal<boolean> =
    this._articleListStore.isFetchArticleListLoading;

  readonly articleList: Signal<ArticlePreview[] | null> =
    this._articleListStore.articles;
  readonly isFetchArticleListError =
    this._articleListStore.isFetchArticleListError;

  constructor() {
    this._articleListStore.fetchArticleList(null);
  }
}
