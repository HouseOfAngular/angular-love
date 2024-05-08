import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureAuthorComponent } from './feature-author.component';

describe('BlogAuthorsFeatureAuthorComponent', () => {
  let component: FeatureAuthorComponent;
  let fixture: ComponentFixture<FeatureAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureAuthorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
