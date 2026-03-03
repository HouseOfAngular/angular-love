import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationsPageComponent } from './presentations-page.component';

describe('PresentationsPageComponent', () => {
  let component: PresentationsPageComponent;
  let fixture: ComponentFixture<PresentationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentationsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PresentationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
