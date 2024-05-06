import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleUiBackgroundCardComponent } from './article-ui-background-card.component';

// @todo replace with spectator
describe('BackgroundArticleCardComponent', () => {
  let component: ArticleUiBackgroundCardComponent;
  let fixture: ComponentFixture<ArticleUiBackgroundCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleUiBackgroundCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleUiBackgroundCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
