import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ArticleCardComponent } from './article-card/article-card.component';
import { ArticlesService } from '@angular-love/blog/articles/data-access';

@Component({
  standalone: true,
  selector: 'angular-love-articles-list',
  templateUrl: './articles-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArticleCardComponent, AsyncPipe],
})
export class ArticlesListComponent {
  readonly articlesList$ = inject(ArticlesService).getArticlesList();
}
