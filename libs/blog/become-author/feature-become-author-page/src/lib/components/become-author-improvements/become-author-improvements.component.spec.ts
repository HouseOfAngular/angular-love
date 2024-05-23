import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAuthorImprovementsComponent } from './become-author-improvements.component';

// @todo-replace-with-spectator//
describe('BecomeAuthorImprovementsComponent', () => {
  let component: BecomeAuthorImprovementsComponent;
  let fixture: ComponentFixture<BecomeAuthorImprovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeAuthorImprovementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BecomeAuthorImprovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
