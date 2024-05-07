import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureGuidesComponent } from './feature-guides.component';

describe('FeatureGuidesComponent', () => {
  let component: FeatureGuidesComponent;
  let fixture: ComponentFixture<FeatureGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureGuidesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
