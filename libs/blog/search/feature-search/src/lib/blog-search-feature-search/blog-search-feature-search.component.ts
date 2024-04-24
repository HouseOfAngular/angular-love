import { SearchService } from '@angular-love/blog/search/data-access';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'al-feature-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './blog-search-feature-search.component.html',
  styleUrl: './blog-search-feature-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SearchService],
})
export class BlogSearchFeatureSearchComponent implements OnInit {
  private readonly _searchService = inject(SearchService);

  searchForm = new FormControl('');

  ngOnInit(): void {
    this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe((v) => {
      this._searchService.searchArticles(v as string);
    });
  }
}
