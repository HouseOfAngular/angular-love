import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorCardComponent } from './author-card.component';

describe('AuthorInfoComponent', () => {
  let component: AuthorCardComponent;
  let fixture: ComponentFixture<AuthorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
