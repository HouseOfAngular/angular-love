import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsletterSuccessComponent } from './newsletter-success.component';

describe('NewsletterSuccessComponent', () => {
  let component: NewsletterSuccessComponent;
  let fixture: ComponentFixture<NewsletterSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsletterSuccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsletterSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
