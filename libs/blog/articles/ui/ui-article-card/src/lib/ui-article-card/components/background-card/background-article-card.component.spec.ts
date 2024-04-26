import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackgroundArticleCardComponent } from './background-article-card.component';

// @todo replace with spectator
describe('BackgroundArticleCardComponent', () => {
  let component: BackgroundArticleCardComponent;
  let fixture: ComponentFixture<BackgroundArticleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundArticleCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackgroundArticleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
