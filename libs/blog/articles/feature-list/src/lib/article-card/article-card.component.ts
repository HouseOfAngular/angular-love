import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  CardComponent,
  CardContentDirective,
  CardFooterDirective,
  CardHeaderDirective,
  CardHoverHighlightDirective,
} from '@angular-love/blog/shared/ui/card';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { DatePipe, NgOptimizedImage } from '@angular/common';

export interface UiArticleCard {
  title: string;
  excerpt: string;
  featuredImageUrl: string;
  publishDate: string;
  author: {
    name: string;
    avatarUrl: string;
  };
}

@Component({
  standalone: true,
  selector: 'angular-love-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    AvatarComponent,
    NgOptimizedImage,
    CardHeaderDirective,
    CardContentDirective,
    CardFooterDirective,
    CardHoverHighlightDirective,
    DatePipe,
  ],
})
export class ArticleCardComponent {
  @Input({ required: true }) articleCard!: UiArticleCard;
}
