import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesRowComponent } from './rules-row.component';

describe('RulesListComponent', () => {
  let component: RulesRowComponent;
  let fixture: ComponentFixture<RulesRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulesRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RulesRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
