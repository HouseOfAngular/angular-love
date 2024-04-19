import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {
  CardComponent,
  CardContentDirective,
  CardFooterDirective,
  CardHeaderDirective,
  CardHoverHighlightDirective,
  CardLinkableDirective,
} from '@angular-love/blog/shared/ui/card';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapClock } from '@ng-icons/bootstrap-icons';
import { RouterLink } from '@angular/router';
import { SmallArticleCardDataModel } from '@angular-love/small-article-card-data-model';

@Component({
  selector: 'al-small-article-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CardComponent,
    AvatarComponent,
    CardContentDirective,
    CardFooterDirective,
    CardHeaderDirective,
    CardHoverHighlightDirective,
    CardLinkableDirective,
    NgIcon,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './small-article-card.component.html',
  styleUrl: './small-article-card.component.scss',
  providers: [
    provideIcons({
      bootstrapClock,
    }),
  ],
})
export class SmallArticleCardComponent {
  article = input.required<SmallArticleCardDataModel>();
}
