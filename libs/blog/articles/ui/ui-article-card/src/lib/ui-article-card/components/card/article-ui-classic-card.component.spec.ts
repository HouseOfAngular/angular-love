import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleUiClassicCardComponent } from './article-ui-classic-card.component';

// @todo replace with spectator
describe('ArticleUiClassicCardComponent', () => {
  let component: ArticleUiClassicCardComponent;
  let fixture: ComponentFixture<ArticleUiClassicCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleUiClassicCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleUiClassicCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
