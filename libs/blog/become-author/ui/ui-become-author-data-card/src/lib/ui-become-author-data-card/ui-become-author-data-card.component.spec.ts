import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBecomeAuthorDataCardComponent } from './ui-become-author-data-card.component';

// @todo-replace-with-spectator//
describe('UiBecomeAuthorDataCardComponent', () => {
  let component: UiBecomeAuthorDataCardComponent;
  let fixture: ComponentFixture<UiBecomeAuthorDataCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBecomeAuthorDataCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiBecomeAuthorDataCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
