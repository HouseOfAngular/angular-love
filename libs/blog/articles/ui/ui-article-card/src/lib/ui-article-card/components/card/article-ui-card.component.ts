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
import { bootstrapClock } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';

import { ArticleCardDataModel } from '@angular-love/article-card-data-model';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';

export type Layout = 'regular' | 'horizontal';

type SanitizedArticleDataModel = {
  title: string;
  excerpt: string;
};

@Component({
  selector: 'al-article-ui-card',
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
  templateUrl: './article-ui-card.component.html',
  styleUrl: './article-ui-card.component.scss',
  providers: [
    provideIcons({
      bootstrapClock,
    }),
  ],
})
export class ArticleUiCardComponent {
  private readonly domSanitizer = inject(DomSanitizer);
  layout = input.required<Layout>();
  article = input.required<ArticleCardDataModel>();

  sanitizedArticle = computed<SanitizedArticleDataModel>(() => {
    return {
      excerpt: this.sanitize(this.article().excerpt),
      title: this.sanitize(this.article().title),
    };
  });

  private sanitize(val: string): string {
    return this.domSanitizer.sanitize(SecurityContext.HTML, val) || '';
  }
}
