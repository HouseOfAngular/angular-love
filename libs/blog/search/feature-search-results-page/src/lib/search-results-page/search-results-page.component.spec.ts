import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsPageComponent } from './search-results-page.component';

describe('FeatureSearchResultsPageComponent', () => {
  let component: SearchResultsPageComponent;
  let fixture: ComponentFixture<SearchResultsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
