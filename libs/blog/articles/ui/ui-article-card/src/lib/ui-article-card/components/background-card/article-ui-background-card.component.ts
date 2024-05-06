import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArticleCardDataModel } from '@angular-love/article-card-data-model';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { IconComponent } from '@angular-love/icon';

export type Layout = 'compact' | 'hero';

@Component({
  selector: 'al-article-ui-background-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AvatarComponent, RouterLink, DatePipe, NgClass, IconComponent],
  templateUrl: './article-ui-background-card.component.html',
})
export class ArticleUiBackgroundCardComponent {
  layout = input.required<Layout>();
  article = input.required<ArticleCardDataModel>();
}
