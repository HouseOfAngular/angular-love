import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleUiCardComponent } from './article-ui-card.component';

// @todo replace with spectator
describe('ArticleUiClassicCardComponent', () => {
  let component: ArticleUiCardComponent;
  let fixture: ComponentFixture<ArticleUiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleUiCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleUiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
