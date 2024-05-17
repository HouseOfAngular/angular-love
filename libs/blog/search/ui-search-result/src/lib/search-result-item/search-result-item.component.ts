import { ChangeDetectionStrategy, Component, input } from '@angular/core';

interface UiSearchResultItem {
  post_author: {
    user_avatar_url: string;
    display_name: string;
  };
  post_title: 'Main';
  post_date_formatted: string;
  reading_time: number | null;
}

@Component({
  selector: 'al-search-result-item',
  standalone: true,
  templateUrl: './search-result-item.component.html',
  styleUrl: './search-result-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultItemComponent {
  hit = input.required<UiSearchResultItem>();
}
