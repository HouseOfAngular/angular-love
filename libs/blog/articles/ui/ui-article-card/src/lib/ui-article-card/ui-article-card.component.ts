import { ArticleCardDataModel } from '@angular-love/article-card-data-model';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArticleUiBackgroundCardComponent } from './components/background-card/article-ui-background-card.component';
import { ArticleUiCardComponent } from './components/card/article-ui-card.component';

export type CardType = 'regular' | 'horizontal' | 'compact' | 'hero';

@Component({
  selector: 'al-ui-article-card',
  standalone: true,
  templateUrl: './ui-article-card.component.html',
  styleUrl: './ui-article-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArticleUiBackgroundCardComponent, ArticleUiCardComponent],
})
export class UiArticleCardComponent {
  cardType = input.required<CardType>();
  article = input.required<ArticleCardDataModel>();
}
