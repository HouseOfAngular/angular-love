import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAuthorAdvertisementComponent } from './become-author-advertisement.component';

// @todo-replace-with-spectator//
describe('BecomeAuthorAdvertisementComponent', () => {
  let component: BecomeAuthorAdvertisementComponent;
  let fixture: ComponentFixture<BecomeAuthorAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeAuthorAdvertisementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BecomeAuthorAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
