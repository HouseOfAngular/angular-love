import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingRulesComponent } from './writing-rules.component';

describe('FeatureWritingRulesComponent', () => {
  let component: WritingRulesComponent;
  let fixture: ComponentFixture<WritingRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritingRulesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WritingRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
