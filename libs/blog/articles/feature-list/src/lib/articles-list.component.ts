import {
  ArticleListSignalStore,
  ArticlePreview,
} from '@angular-love/blog/articles/data-access';
import { RepeatDirective } from '@angular-love/utils';
import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { ArticleCardSkeletonComponent } from './article-card/article-card-skeleton.component';
import { ArticleCardComponent } from './article-card/article-card.component';

@Component({
  selector: 'angular-love-articles-list',
  templateUrl: './articles-list.component.html',
  imports: [
    ArticleCardComponent,
    ArticleCardSkeletonComponent,
    RepeatDirective,
    AsyncPipe,
    JsonPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ArticlesListComponent {
  private readonly articleListSignalStore = inject(ArticleListSignalStore);

  readonly isFetchArticleListLoading: Signal<boolean> =
    this.articleListSignalStore.isFetchArticleListLoading;

  readonly articleList: Signal<ArticlePreview[] | null> =
    this.articleListSignalStore.articles;

  constructor() {
    this.articleListSignalStore.fetchArticleList({ query: null });
  }
}
