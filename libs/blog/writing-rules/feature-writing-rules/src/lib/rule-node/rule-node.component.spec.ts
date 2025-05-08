import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleNodeComponent } from './rule-node.component';

describe('RuleNodeComponent', () => {
  let component: RuleNodeComponent;
  let fixture: ComponentFixture<RuleNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RuleNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
