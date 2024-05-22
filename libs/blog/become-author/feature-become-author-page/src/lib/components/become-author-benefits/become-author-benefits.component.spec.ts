import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAuthorBenefitsComponent } from './become-author-benefits.component';

// @todo-replace-with-spectator//
describe('BecomeAuthorBenefitsComponent', () => {
  let component: BecomeAuthorBenefitsComponent;
  let fixture: ComponentFixture<BecomeAuthorBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeAuthorBenefitsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BecomeAuthorBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
