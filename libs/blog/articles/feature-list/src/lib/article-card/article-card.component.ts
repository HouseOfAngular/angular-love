import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  CardComponent,
  CardContentDirective,
  CardFooterDirective,
  CardHeaderDirective,
  CardHoverHighlightDirective,
} from '@angular-love/blog/shared/ui/card';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { NgOptimizedImage } from '@angular/common';

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
  ],
})
export class ArticleCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) content!: string;
  @Input({ required: true }) imageSrc!: string;
  @Input({ required: true }) author!: string;
  @Input({ required: true }) authorImageSrc!: string;
  @Input({ required: true }) date!: string;
}
