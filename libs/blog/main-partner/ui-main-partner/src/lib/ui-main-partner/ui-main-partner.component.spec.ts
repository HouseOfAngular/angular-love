import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMainPartnerComponent } from './ui-main-partner.component';

describe('BlogUiMainPartnerComponent', () => {
  let component: UiMainPartnerComponent;
  let fixture: ComponentFixture<UiMainPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiMainPartnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiMainPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
