import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { ArticleCardComponent } from './article-card/article-card.component';

@Component({
  standalone: true,
  selector: 'angular-love-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, ArticleCardComponent],
})
export class ArticlesListComponent {
  articles = Array.from({ length: 10 });
}
