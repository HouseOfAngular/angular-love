import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChildren,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { BecomeAuthorAdvertisementComponent } from '@angular-love/blog/become-author-page-feature';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';
import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';

import { RulesRowComponent } from '../rules-row/rules-row.component';

import { rulesContentData } from './rules-content';

@Component({
  selector: 'al-writing-rules',
  imports: [
    TranslocoDirective,
    RulesRowComponent,
    BecomeAuthorAdvertisementComponent,
    ButtonComponent,
    CardComponent,
    GradientCardDirective,
  ],
  templateUrl: './writing-rules.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WritingRulesComponent {
  readonly rulesContentData = rulesContentData;
  readonly ruleStepSelectionModel = new SelectionModel<number>(false);
  readonly ruleRows = viewChildren('ruleRow', { read: ElementRef });

  toggleStep(index: number) {
    this.ruleStepSelectionModel.toggle(index);
  }

  scrollIntoRule(index: number): void {
    const element = this.ruleRows()[index]?.nativeElement;
    const selectedValue = this.ruleStepSelectionModel.selected[0];

    if (element && index === selectedValue) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
