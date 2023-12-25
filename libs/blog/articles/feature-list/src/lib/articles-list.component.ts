import { ArticleListSignalStore } from '@angular-love/blog/articles/data-access';
import { RepeatDirective } from '@angular-love/utils';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ArticleCardSkeletonComponent } from './article-card/article-card-skeleton.component';
import { ArticleCardComponent } from './article-card/article-card.component';

@Component({
  standalone: true,
  selector: 'angular-love-articles-list',
  templateUrl: './articles-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ArticleCardComponent,
    ArticleCardSkeletonComponent,
    RepeatDirective,
    AsyncPipe,
    JsonPipe,
  ],
})
export class ArticlesListComponent {
  private readonly articleListSignalStore = inject(ArticleListSignalStore);

  constructor() {
    this.articleListSignalStore.fetchArticleList({ query: null });
  }
}
