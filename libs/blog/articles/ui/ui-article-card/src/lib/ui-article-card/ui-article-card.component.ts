import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BackgroundArticleCardComponent } from './components/background-card/background-article-card.component';

export type UiArticleCardDataModel = {
  title: string;
  excerpt: string;
  slug: string;
  featuredImageUrl: string;
  readingTime: number;
  author: {
    name: string;
    avatarUrl: string;
  };
  publishDate: string;
};

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
  article = input.required<UiArticleCardDataModel>();
}
