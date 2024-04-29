import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureSearchResultsPageComponent } from './feature-search-results-page.component';

describe('FeatureSearchResultsPageComponent', () => {
  let component: FeatureSearchResultsPageComponent;
  let fixture: ComponentFixture<FeatureSearchResultsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureSearchResultsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureSearchResultsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
