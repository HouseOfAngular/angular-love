import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';

import { RelatedArticleListStore } from '@angular-love/blog/articles/data-access';
import { UiArticleCardComponent } from '@angular-love/blog/articles/ui-article-card';

@Component({
  selector: 'al-related-articles',
  template: `
    @if (store.isFetchRelatedArticleListLoaded()) {
      <strong class="text-3xl">Related Articles</strong>
      <div class="mt-4 grid grid-cols-1 gap-6 p-2 md:grid-cols-2">
        @for (article of store.relatedArticles(); track $index) {
          <al-article-card [article]="article" cardType="compact" />
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RelatedArticleListStore],
  imports: [UiArticleCardComponent],
})
export class RelatedArticlesComponent implements OnInit {
  readonly id = input.required<number>();

  readonly store = inject(RelatedArticleListStore);

  ngOnInit(): void {
    this.store.fetchArticleList(this.id);
  }
}
