import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureSearchComponent } from './feature-search.component';

// @todo replace with spectator
describe('FeatureSearchComponent', () => {
  let component: FeatureSearchComponent;
  let fixture: ComponentFixture<FeatureSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
