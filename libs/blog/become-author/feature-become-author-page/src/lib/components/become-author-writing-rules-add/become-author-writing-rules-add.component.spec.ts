import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAuthorWritingRulesAddComponent } from './become-author-writing-rules-add.component';

describe('BecomeAuthorWritingRulesAddComponent', () => {
  let component: BecomeAuthorWritingRulesAddComponent;
  let fixture: ComponentFixture<BecomeAuthorWritingRulesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeAuthorWritingRulesAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BecomeAuthorWritingRulesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
