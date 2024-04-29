import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { DatePipe, NgClass, NgOptimizedImage, NgStyle } from '@angular/common';
import { bootstrapClock } from '@ng-icons/bootstrap-icons';
import { ArticleCardDataModel } from '@angular-love/article-card-data-model';

export type Layout = 'regular' | 'horizontal';

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
  article = input.required<ArticleCardDataModel>();
}
