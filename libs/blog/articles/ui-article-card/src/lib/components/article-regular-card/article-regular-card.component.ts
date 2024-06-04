import { DatePipe, NgClass, NgOptimizedImage, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { ArticleCard } from '@angular-love/blog/shared/types';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';
import { UiDifficultyComponent } from '@angular-love/blog/shared/ui-difficulty';
import { IconComponent } from '@angular-love/blog/shared/ui-icon';

export type Layout = 'regular' | 'horizontal';

type SanitizedArticleDataModel = {
  title: string;
  excerpt: string;
};

@Component({
  selector: 'al-article-regular-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AvatarComponent,
    DatePipe,
    NgClass,
    NgStyle,
    IconComponent,
    RouterLink,
    NgOptimizedImage,
    UiDifficultyComponent,
  ],
  templateUrl: './article-regular-card.component.html',
  styleUrl: './article-regular-card.component.scss',
})
export class ArticleRegularCardComponent {
  layout = input.required<Layout>();
  article = input.required<ArticleCard>();

  sanitizedArticle = computed<SanitizedArticleDataModel>(() => {
    return {
      excerpt: this.sanitize(this.article().excerpt),
      title: this.sanitize(this.article().title),
    };
  });

  private readonly domSanitizer = inject(DomSanitizer);

  private sanitize(val: string): string {
    return this.domSanitizer.sanitize(SecurityContext.HTML, val) || '';
  }
}
