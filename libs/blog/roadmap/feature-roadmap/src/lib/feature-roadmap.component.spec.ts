import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureRoadmapComponent } from './feature-roadmap.component';

describe('FeatureRoadmapComponent', () => {
  let component: FeatureRoadmapComponent;
  let fixture: ComponentFixture<FeatureRoadmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureRoadmapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureRoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
