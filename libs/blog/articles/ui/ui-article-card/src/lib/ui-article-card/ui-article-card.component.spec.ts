import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiArticleCardComponent } from './ui-article-card.component';

describe('UiArticleCardComponent', () => {
  let component: UiArticleCardComponent;
  let fixture: ComponentFixture<UiArticleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiArticleCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiArticleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
