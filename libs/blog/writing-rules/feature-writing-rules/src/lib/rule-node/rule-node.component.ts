import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { RuleNode } from '../interfaces/node.interface';

@Component({
  selector: 'al-rule-node',
  imports: [TranslocoDirective, NgClass],
  templateUrl: './rule-node.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RuleNodeComponent {
  node = input<RuleNode[]>();
}
