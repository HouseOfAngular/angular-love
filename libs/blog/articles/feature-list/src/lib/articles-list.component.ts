import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ArticleCardComponent } from './article-card/article-card.component';
import { ArticleListService } from '@angular-love/blog/articles/data-access';
import { ArticleCardSkeletonComponent } from './article-card/article-card-skeleton.component';
import { RepeatDirective } from '@angular-love/utils';

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
  private readonly articleListService = inject(ArticleListService);
  readonly articlesList$ = this.articleListService.articlesListData$;
  readonly articlesListLoading$ = this.articleListService.articlesListLoading$;

  constructor() {
    this.articleListService.fetchArticles();
  }
}
