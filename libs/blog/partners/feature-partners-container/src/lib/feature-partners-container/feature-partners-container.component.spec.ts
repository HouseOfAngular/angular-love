import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturePartnersContainerComponent } from './feature-partners-container.component';

//TO-DO-REPLACE-WITH-SPECTATOR//
describe('FeaturePartnersContainerComponent', () => {
  let component: FeaturePartnersContainerComponent;
  let fixture: ComponentFixture<FeaturePartnersContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePartnersContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePartnersContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
