import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { RuleNode } from '../interfaces/node.interface';
import { RuleNodeComponent } from '../rule-node/rule-node.component';

@Component({
  selector: 'al-rules-row',
  imports: [FastSvgComponent, RuleNodeComponent, TranslocoDirective],
  templateUrl: './rules-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesRowComponent {
  index = input.required<number>();
  step = input.required<RuleNode>();
  first = input.required<boolean>();
  last = input.required<boolean>();
  isOpen = input<boolean>(false);

  toggleStep = output<number>();
  scrollToRule = output<number>();
}
