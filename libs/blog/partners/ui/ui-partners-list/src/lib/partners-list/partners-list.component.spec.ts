import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartnersListComponent } from './partners-list.component';

//@todo-replace-with-spectator//
describe('PartnersListComponent', () => {
  let component: PartnersListComponent;
  let fixture: ComponentFixture<PartnersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnersListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
