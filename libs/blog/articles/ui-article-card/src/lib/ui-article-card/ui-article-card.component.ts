import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ArticleCard } from '@angular-love/blog/shared/types';

import { ArticleCompactCardComponent } from '../components/article-compact-card/article-compact-card.component';
import { ArticleHeroCardComponent } from '../components/article-hero-card/article-hero-card.component';
import { ArticleHorizontalCardComponent } from '../components/article-horizontal-card/article-horizontal-card.component';
import { ArticleRegularCardComponent } from '../components/article-regular-card/article-regular-card.component';

export type CardType = 'regular' | 'horizontal' | 'compact' | 'hero';

@Component({
  selector: 'al-article-card',
  standalone: true,
  templateUrl: './ui-article-card.component.html',
  styleUrl: './ui-article-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ArticleRegularCardComponent,
    ArticleHorizontalCardComponent,
    ArticleHeroCardComponent,
    ArticleCompactCardComponent,
  ],
  host: {
    'data-testid': 'article-card',
    '[attr.id]': 'article().slug',
  },
})
export class UiArticleCardComponent {
  cardType = input.required<CardType>();
  article = input.required<ArticleCard>();
}
