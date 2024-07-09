import { DatePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

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
  imports: [NgOptimizedImage, DatePipe, FastSvgComponent],
})
export class SearchResultItemComponent {
  @HostBinding('class') hostClasses = 'flex flex-col p-6 hover:bg-al-border';

  readonly item = input.required<UiSearchResultItem>();
}
