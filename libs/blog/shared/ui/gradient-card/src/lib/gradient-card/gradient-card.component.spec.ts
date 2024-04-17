import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradientCardComponent } from './gradient-card.component';

describe('GradientCardComponent', () => {
  let component: GradientCardComponent;
  let fixture: ComponentFixture<GradientCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradientCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GradientCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
