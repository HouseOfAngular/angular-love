import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureAboutUsComponent } from './feature-about-us.component';

describe('FeatureAboutUsComponent', () => {
  let component: FeatureAboutUsComponent;
  let fixture: ComponentFixture<FeatureAboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureAboutUsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
