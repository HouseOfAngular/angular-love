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

import { ArticleCardSkeletonComponent } from './article-card/article-card-skeleton.component';
import { ArticleCardComponent } from './article-card/article-card.component';

@Component({
  selector: 'al-articles-list',
  templateUrl: './articles-list-container.component.html',
  imports: [
    ArticleCardComponent,
    ArticleCardSkeletonComponent,
    RepeatDirective,
    AsyncPipe,
    JsonPipe,
    ArticleCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ArticlesListContainerComponent {
  private readonly articleListStore = inject(ArticleListStore);

  readonly isFetchArticleListLoading: Signal<boolean> =
    this.articleListStore.isFetchArticleListLoading;

  readonly articleList: Signal<ArticlePreview[] | null> =
    this.articleListStore.articles;
  readonly isFetchArticleListError =
    this.articleListStore.isFetchArticleListError;

  constructor() {
    this.articleListStore.fetchArticleList({ query: null });
  }
}
