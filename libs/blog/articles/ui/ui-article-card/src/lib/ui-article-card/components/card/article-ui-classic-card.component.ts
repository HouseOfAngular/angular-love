import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { DatePipe, NgClass, NgOptimizedImage, NgStyle } from '@angular/common';
import { bootstrapClock } from '@ng-icons/bootstrap-icons';

export type Layout = 'regular' | 'horizontal';

export type ArticleData = {
  title: string;
  excerpt: string;
  slug: string;
  publishDate: string;
  featuredImageUrl: string;
  readingTime: number;
  author: {
    name: string;
    avatarUrl: string;
  };
};

@Component({
  selector: 'al-ui-article-classic-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AvatarComponent,
    NgIcon,
    DatePipe,
    NgOptimizedImage,
    NgClass,
    NgStyle,
  ],
  templateUrl: './article-ui-classic-card.component.html',
  styleUrl: './article-ui-classic-card.component.scss',
  providers: [
    provideIcons({
      bootstrapClock,
    }),
  ],
})
export class ArticleUiClassicCardComponent {
  layout = input.required<Layout>();
  article = input.required<ArticleData>();
}
