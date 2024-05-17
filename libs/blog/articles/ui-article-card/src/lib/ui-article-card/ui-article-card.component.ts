import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ArticleCard } from '@angular-love/blog/shared/types';

import { ArticleBackgroundCardComponent } from '../components/article-background-card/article-background-card.component';
import { ArticleRegularCardComponent } from '../components/article-regular-card/article-regular-card.component';

export type CardType = 'regular' | 'horizontal' | 'compact' | 'hero';

@Component({
  selector: 'al-article-card',
  standalone: true,
  templateUrl: './ui-article-card.component.html',
  styleUrl: './ui-article-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArticleBackgroundCardComponent, ArticleRegularCardComponent],
})
export class UiArticleCardComponent {
  cardType = input.required<CardType>();
  article = input.required<ArticleCard>();
}
