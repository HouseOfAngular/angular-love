import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBecomeAuthorDataSectionComponent } from './ui-become-author-data-section.component';

// @todo-replace-with-spectator//
describe('UiBecomeAuthorDataSectionComponent', () => {
  let component: UiBecomeAuthorDataSectionComponent;
  let fixture: ComponentFixture<UiBecomeAuthorDataSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBecomeAuthorDataSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiBecomeAuthorDataSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
