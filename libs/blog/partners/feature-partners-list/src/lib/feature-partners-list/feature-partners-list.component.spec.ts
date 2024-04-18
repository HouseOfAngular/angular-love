import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturePartnersListComponent } from './feature-partners-list.component';

//TO-DO-REPLACE-WITH-SPECTACTOR//
describe('FeaturePartnersListComponent', () => {
  let component: FeaturePartnersListComponent;
  let fixture: ComponentFixture<FeaturePartnersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePartnersListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePartnersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
