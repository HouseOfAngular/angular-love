import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiEbookComponent } from './ui-ebook.component';

describe('UiEbookComponent', () => {
  let component: UiEbookComponent;
  let fixture: ComponentFixture<UiEbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiEbookComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiEbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
