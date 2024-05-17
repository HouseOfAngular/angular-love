import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleRegularCardComponent } from './article-regular-card.component';

// @todo replace with spectator
describe('ArticleUiClassicCardComponent', () => {
  let component: ArticleRegularCardComponent;
  let fixture: ComponentFixture<ArticleRegularCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleRegularCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleRegularCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
