import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArticleCard } from '@angular-love/blog/shared/types';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';
import { IconComponent } from '@angular-love/blog/shared/ui-icon';

export type Layout = 'compact' | 'hero';

@Component({
  selector: 'al-article-background-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AvatarComponent, RouterLink, DatePipe, NgClass, IconComponent],
  templateUrl: './article-background-card.component.html',
})
export class ArticleBackgroundCardComponent {
  layout = input.required<Layout>();
  article = input.required<ArticleCard>();
}