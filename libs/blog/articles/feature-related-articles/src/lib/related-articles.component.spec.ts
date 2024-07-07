import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedArticlesComponent } from './related-articles.component';

describe('RelatedArticlesComponent', () => {
  let component: RelatedArticlesComponent;
  let fixture: ComponentFixture<RelatedArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedArticlesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatedArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
