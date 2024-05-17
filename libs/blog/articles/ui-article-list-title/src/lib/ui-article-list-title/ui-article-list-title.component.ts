import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ArticleTitleLink = {
  displayName: string;
  href: string;
};

@Component({
  selector: 'al-article-list-title',
  standalone: true,
  templateUrl: './ui-article-list-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiArticleListTitleComponent {
  title = input.required<string>();
  link = input<ArticleTitleLink>();
}
