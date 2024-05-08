import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureNewsComponent } from './feature-news.component';

describe('BlogArticlesFeatureNewsComponent', () => {
  let component: FeatureNewsComponent;
  let fixture: ComponentFixture<FeatureNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureNewsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
