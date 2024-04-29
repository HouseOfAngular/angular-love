import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogSearchFeatureSearchComponent } from './blog-search-feature-search.component';

describe('BlogSearchFeatureSearchComponent', () => {
  let component: BlogSearchFeatureSearchComponent;
  let fixture: ComponentFixture<BlogSearchFeatureSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogSearchFeatureSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogSearchFeatureSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
