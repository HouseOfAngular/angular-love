import { DatePipe, NgOptimizedImage, NgStyle } from '@angular/common';
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
import { LocalizeRouterModule } from '@penleychan/ngx-transloco-router';

import { ArticleCard } from '@angular-love/blog/shared/types';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';
import { UiDifficultyComponent } from '@angular-love/blog/shared/ui-difficulty';
import { IconComponent } from '@angular-love/blog/shared/ui-icon';

type SanitizedArticleDataModel = {
  title: string;
  excerpt: string;
};

@Component({
  selector: 'al-article-horizontal-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AvatarComponent,
    DatePipe,
    NgStyle,
    IconComponent,
    RouterLink,
    NgOptimizedImage,
    UiDifficultyComponent,
    LocalizeRouterModule,
  ],
  templateUrl: './article-horizontal-card.component.html',
})
export class ArticleHorizontalCardComponent {
  article = input.required<ArticleCard>();
  imagePriority = input<number | null>(null);

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
