import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleBackgroundCardComponent } from './article-background-card.component';

// @todo replace with spectator
describe('BackgroundArticleCardComponent', () => {
  let component: ArticleBackgroundCardComponent;
  let fixture: ComponentFixture<ArticleBackgroundCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleBackgroundCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleBackgroundCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
