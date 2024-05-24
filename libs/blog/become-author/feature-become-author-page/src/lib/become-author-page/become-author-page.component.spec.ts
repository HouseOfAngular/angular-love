import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAuthorPageFeatureComponent } from './become-author-page.component';

// @todo-replace-with-spectator//
describe('BecomeAuthorPageFeatureComponent', () => {
  let component: BecomeAuthorPageFeatureComponent;
  let fixture: ComponentFixture<BecomeAuthorPageFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeAuthorPageFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BecomeAuthorPageFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
