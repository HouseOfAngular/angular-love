import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmallArticleCardComponent } from './small-article-card.component';

// --TO-DO--USE-SPECTATOR-WHEN-AVAILABLE
describe('SmallArticleCardComponent', () => {
  let component: SmallArticleCardComponent;
  let fixture: ComponentFixture<SmallArticleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallArticleCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmallArticleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
