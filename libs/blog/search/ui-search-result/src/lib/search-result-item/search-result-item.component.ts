import { DatePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';

import { IconComponent } from '@angular-love/blog/shared/ui-icon';

interface UiSearchResultItem {
  publishDate: Date;
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
  imports: [NgOptimizedImage, IconComponent, DatePipe],
})
export class SearchResultItemComponent {
  @HostBinding('class') hostClasses = 'flex flex-col p-6 hover:bg-al-border';

  item = input.required<UiSearchResultItem>();
}
