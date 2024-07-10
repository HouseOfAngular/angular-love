import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleHeroCardComponent } from './article-hero-card.component';

// @todo replace with spectator
describe('ArticleHeroCardComponent', () => {
  let component: ArticleHeroCardComponent;
  let fixture: ComponentFixture<ArticleHeroCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleHeroCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleHeroCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
