import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiscusCommentsComponent } from './giscus-comments.component';

describe('BlogArticlesFeatureCommentsComponent', () => {
  let component: GiscusCommentsComponent;
  let fixture: ComponentFixture<GiscusCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiscusCommentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GiscusCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
