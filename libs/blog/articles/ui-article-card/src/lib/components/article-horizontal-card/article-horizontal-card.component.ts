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
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';
import { ArticleCard } from '@angular-love/blog/shared/types';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';
import { UiDifficultyComponent } from '@angular-love/blog/shared/ui-difficulty';

type SanitizedArticleDataModel = {
  title: string;
  excerpt: string;
};

@Component({
  selector: 'al-article-horizontal-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarComponent,
    DatePipe,
    NgStyle,
    RouterLink,
    NgOptimizedImage,
    UiDifficultyComponent,
    AlLocalizePipe,
    FastSvgComponent,
  ],
  templateUrl: './article-horizontal-card.component.html',
})
export class ArticleHorizontalCardComponent {
  readonly article = input.required<ArticleCard>();
  readonly imagePriority = input<number | null>(null);

  sanitizedArticle = computed<SanitizedArticleDataModel>(() => {
    return {
      excerpt: this._sanitize(this.article().excerpt),
      title: this._sanitize(this.article().title),
    };
  });

  private readonly _domSanitizer = inject(DomSanitizer);

  private _sanitize(val: string): string {
    return this._domSanitizer.sanitize(SecurityContext.HTML, val) || '';
  }
}
