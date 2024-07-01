import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizeRouterModule } from '@penleychan/ngx-transloco-router';

import { ArticleCard } from '@angular-love/blog/shared/types';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';
import { UiDifficultyComponent } from '@angular-love/blog/shared/ui-difficulty';
import { IconComponent } from '@angular-love/blog/shared/ui-icon';

@Component({
  selector: 'al-article-compact-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AvatarComponent,
    RouterLink,
    DatePipe,
    IconComponent,
    UiDifficultyComponent,
    LocalizeRouterModule,
  ],
  templateUrl: './article-compact-card.component.html',
})
export class ArticleCompactCardComponent {
  article = input.required<ArticleCard>();
}
