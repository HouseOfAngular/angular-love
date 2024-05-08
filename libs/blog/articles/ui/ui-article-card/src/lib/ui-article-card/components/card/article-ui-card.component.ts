import { DatePipe, NgClass, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ArticleCardDataModel } from '@angular-love/article-card-data-model';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { IconComponent } from '@angular-love/icon';

export type Layout = 'regular' | 'horizontal';

type SanitizedArticleDataModel = {
  title: string;
  excerpt: string;
};

@Component({
  selector: 'al-article-ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AvatarComponent, DatePipe, NgClass, NgStyle, IconComponent],
  templateUrl: './article-ui-card.component.html',
  styleUrl: './article-ui-card.component.scss',
})
export class ArticleUiCardComponent {
  layout = input.required<Layout>();
  article = input.required<ArticleCardDataModel>();

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
