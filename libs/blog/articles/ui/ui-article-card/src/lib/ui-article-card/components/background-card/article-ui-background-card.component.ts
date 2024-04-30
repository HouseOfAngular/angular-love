import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, NgClass, NgOptimizedImage } from '@angular/common';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapClock } from '@ng-icons/bootstrap-icons';
import { RouterLink } from '@angular/router';
import { ArticleCardDataModel } from '@angular-love/article-card-data-model';

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
