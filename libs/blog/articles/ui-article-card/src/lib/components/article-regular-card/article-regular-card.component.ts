import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';
import { ArticleCard } from '@angular-love/blog/shared/types';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';

@Component({
  selector: 'al-article-regular-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarComponent,
    RouterLink,
    NgOptimizedImage,
    FastSvgComponent,
    AlLocalizePipe,
  ],
  templateUrl: './article-regular-card.component.html',
})
export class ArticleRegularCardComponent {
  readonly article = input.required<ArticleCard>();
  readonly imagePriority = input<number | null>(null);
}
