import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorInfoComponent } from './author-info.component';

describe('AuthorInfoComponent', () => {
  let component: AuthorInfoComponent;
  let fixture: ComponentFixture<AuthorInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
