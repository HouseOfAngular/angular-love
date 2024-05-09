import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureLatestArticlesComponent } from './feature-latest-articles.component';

// @todo replace with spectator
describe('FeatureLatestArticlesComponent', () => {
  let component: FeatureLatestArticlesComponent;
  let fixture: ComponentFixture<FeatureLatestArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureLatestArticlesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureLatestArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
