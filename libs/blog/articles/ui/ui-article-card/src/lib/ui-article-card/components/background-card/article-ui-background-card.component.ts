import { DatePipe, NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { bootstrapClock } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';

import { ArticleCardDataModel } from '@angular-love/article-card-data-model';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';

export type Layout = 'compact' | 'hero';

@Component({
  selector: 'al-article-ui-background-card',
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
  templateUrl: './article-ui-background-card.component.html',
  //@todo replace bootstrap clock
  providers: [
    provideIcons({
      bootstrapClock,
    }),
  ],
})
export class ArticleUiBackgroundCardComponent {
  layout = input.required<Layout>();
  article = input.required<ArticleCardDataModel>();
}
