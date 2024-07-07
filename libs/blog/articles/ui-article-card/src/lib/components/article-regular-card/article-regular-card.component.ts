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
import { FastSvgComponent } from "@push-based/ngx-fast-svg";

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
    NgStyle,
    RouterLink,
    NgOptimizedImage,
    UiDifficultyComponent,
    LocalizeRouterModule,
    FastSvgComponent,
  ],
  templateUrl: './article-regular-card.component.html',
})
export class ArticleRegularCardComponent {
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
