import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAuthorListItemComponent } from './become-author-list-item.component';

// @todo-replace-with-spectator//
describe('BecomeAuthorListItemComponent', () => {
  let component: BecomeAuthorListItemComponent;
  let fixture: ComponentFixture<BecomeAuthorListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeAuthorListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BecomeAuthorListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
