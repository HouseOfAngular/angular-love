import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';

export type ArticleTitleLink = {
  displayName: string;
  href: string;
};

@Component({
  selector: 'al-article-list-title',
  standalone: true,
  templateUrl: './ui-article-list-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AlLocalizePipe],
})
export class UiArticleListTitleComponent {
  title = input.required<string>();
  link = input<ArticleTitleLink | null>();
}
