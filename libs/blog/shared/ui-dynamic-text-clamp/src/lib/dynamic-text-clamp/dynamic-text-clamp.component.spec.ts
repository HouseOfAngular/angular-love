import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTextClampComponent } from './dynamic-text-clamp.component';

describe('DynamicTextClampComponent', () => {
  let component: DynamicTextClampComponent;
  let fixture: ComponentFixture<DynamicTextClampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTextClampComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicTextClampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
