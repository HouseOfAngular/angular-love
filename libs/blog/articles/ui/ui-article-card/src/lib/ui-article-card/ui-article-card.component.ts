import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BackgroundArticleCardComponent } from './components/background-card/background-article-card.component';
import { ArticleCardDataModel } from '@angular-love/article-card-data-model';

export type CardType = 'regular' | 'horizontal' | 'compact' | 'hero';

@Component({
  selector: 'al-ui-article-card',
  standalone: true,
  templateUrl: './ui-article-card.component.html',
  styleUrl: './ui-article-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BackgroundArticleCardComponent],
})
export class UiArticleCardComponent {
  cardType = input.required<CardType>();
  article = input.required<ArticleCardDataModel>();
}
