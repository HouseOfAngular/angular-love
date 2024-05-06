import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ArticleCardDataModel } from '@angular-love/article-card-data-model';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { IconComponent } from '@angular-love/icon';

export type Layout = 'regular' | 'horizontal';

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
}
