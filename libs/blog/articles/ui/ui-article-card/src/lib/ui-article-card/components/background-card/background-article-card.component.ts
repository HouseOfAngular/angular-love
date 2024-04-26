import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, NgClass, NgOptimizedImage } from '@angular/common';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapClock } from '@ng-icons/bootstrap-icons';
import { RouterLink } from '@angular/router';

export type Layout = 'compact' | 'hero';

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

@Component({
  selector: 'al-background-article-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AvatarComponent,
    NgIcon,
    NgOptimizedImage,
    RouterLink,
    DatePipe,
    NgClass,
  ],
  templateUrl: './background-article-card.component.html',
  providers: [
    provideIcons({
      bootstrapClock,
    }),
  ],
})
export class BackgroundArticleCardComponent {
  layout = input.required<Layout>();
  article = input.required<UiArticleCardDataModel>();
}
