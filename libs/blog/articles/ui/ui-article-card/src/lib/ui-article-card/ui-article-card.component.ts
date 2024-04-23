import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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

export type CardType = {
  type: 'BACKGROUND_CARD' | 'CARD';
  layout: 'PRIMARY' | 'SECONDARY';
};
@Component({
  selector: 'al-ui-article-card',
  standalone: true,
  templateUrl: './ui-article-card.component.html',
  styleUrl: './ui-article-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BackgroundArticleCardComponent],
})
export class UiArticleCardComponent {
  @Input() cardType!: CardType;
  @Input() data!: UiArticleCardDataModel;
}
