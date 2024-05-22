import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IconComponent } from '@angular-love/blog/shared/ui-icon';

interface UiSearchResultItem {
  publishDate: string;
  readingTime: string;
  rawTitle: string;
  author: {
    name: string;
    avatarUrl: string;
  };
}

@Component({
  selector: 'al-search-result-item',
  standalone: true,
  templateUrl: './search-result-item.component.html',
  styleUrl: './search-result-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, IconComponent],
})
export class SearchResultItemComponent {
  item = input.required<UiSearchResultItem>();
}
