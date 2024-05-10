import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureRecommendedArticlesComponent } from './feature-recommended-articles.component';

// @todo replace with spectator
describe('FeatureRecommendedArticlesComponent', () => {
  let component: FeatureRecommendedArticlesComponent;
  let fixture: ComponentFixture<FeatureRecommendedArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureRecommendedArticlesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureRecommendedArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
