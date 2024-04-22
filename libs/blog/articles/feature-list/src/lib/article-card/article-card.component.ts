import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  CardComponent,
  CardContentDirective,
  CardFooterDirective,
  CardHeaderDirective,
  CardHoverHighlightDirective,
  CardLinkableDirective,
} from '@angular-love/blog/shared/ui/card';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { DatePipe, NgOptimizedImage } from '@angular/common';

export interface UiArticleCard {
  title: string;
  excerpt: string;
  slug: string;
  featuredImageUrl: string;
  publishDate: string;
  author: {
    name: string;
    avatarUrl: string;
  };
}

@Component({
  standalone: true,
  selector: 'al-article-carde',
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
    CardLinkableDirective,
  ],
})
export class ArticleCardComponent {
  @Input({ required: true }) articleCard!: UiArticleCard;
}
