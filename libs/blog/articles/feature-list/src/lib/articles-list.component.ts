import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ArticleCardComponent } from './article-card/article-card.component';
import { ArticlesService } from '@angular-love/blog/articles/data-access';

@Component({
  standalone: true,
  selector: 'al-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, ArticleCardComponent, AsyncPipe, NgIf],
  providers: [ArticlesService],
})
export class ArticlesListComponent {
  readonly articlesList$ = inject(ArticlesService).getArticlesList(10);
}
