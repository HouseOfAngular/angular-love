import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDifficultyComponent } from './ui-difficulty.component';

describe('BlogSharedUiDifficultyComponent', () => {
  let component: UiDifficultyComponent;
  let fixture: ComponentFixture<UiDifficultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDifficultyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDifficultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
