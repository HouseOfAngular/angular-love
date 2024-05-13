import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBecomeAuthorAdvertisementComponent } from './ui-become-author-advertisement.component';

// @todo-replace-with-spectator//
describe('UiBecomeAuthorDataCardComponent', () => {
  let component: UiBecomeAuthorAdvertisementComponent;
  let fixture: ComponentFixture<UiBecomeAuthorAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBecomeAuthorAdvertisementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiBecomeAuthorAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
