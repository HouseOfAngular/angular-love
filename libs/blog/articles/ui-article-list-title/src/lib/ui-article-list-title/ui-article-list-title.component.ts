import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type ArticleTitleLink = {
  displayName: string;
  href: string;
};

@Component({
  selector: 'al-article-list-title',
  standalone: true,
  templateUrl: './ui-article-list-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class UiArticleListTitleComponent {
  title = input.required<string>();
  link = input<ArticleTitleLink>();
}
