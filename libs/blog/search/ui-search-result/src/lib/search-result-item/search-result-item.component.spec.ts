import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultItemComponent } from './search-result.component';

describe('SearchResultItemComponent', () => {
  let component: SearchResultItemComponent;
  let fixture: ComponentFixture<SearchResultItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
