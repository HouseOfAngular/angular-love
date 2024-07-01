import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleHorizontalCardComponent } from './article-horizontal-card.component';

// @todo replace with spectator
describe('ArticleUiClassicCardComponent', () => {
  let component: ArticleHorizontalCardComponent;
  let fixture: ComponentFixture<ArticleHorizontalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleHorizontalCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleHorizontalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
