import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NodeConnectorType =
  | 'left-end'
  | 'intermediate'
  | 'line'
  | 'right-end';

@Component({
  selector: 'al-node-connector-line',
  template: '',
  host: {
    '[class.left-end]': 'type() === "left-end"',
    '[class.intermediate]': 'type() === "intermediate"',
    '[class.line]': 'type() === "line"',
    '[class.right-end]': 'type() === "right-end"',
  },
  styleUrl: 'node-connector-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeConnectorLineComponent {
  readonly type = input<NodeConnectorType>('line');
}
