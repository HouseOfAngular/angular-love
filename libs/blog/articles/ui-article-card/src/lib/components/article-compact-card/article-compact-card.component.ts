import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';
import { ArticleCard } from '@angular-love/blog/shared/types';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';
import { UiDifficultyComponent } from '@angular-love/blog/shared/ui-difficulty';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

@Component({
  selector: 'al-article-compact-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AvatarComponent,
    RouterLink,
    DatePipe,
    UiDifficultyComponent,
    AlLocalizePipe,
    FastSvgComponent,
  ],
  templateUrl: './article-compact-card.component.html',
})
export class ArticleCompactCardComponent {
  article = input.required<ArticleCard>();
}
