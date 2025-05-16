import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  NodeConnectorLineComponent,
  NodeConnectorType,
} from '../node-connector-line/node-connector-line.component';

@Component({
  selector: 'al-connected-node',
  templateUrl: 'connected-node.component.html',
  imports: [NodeConnectorLineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectedNodeComponent {
  readonly isLeftSideFirst = input<boolean>(false);
  readonly isRightSideLast = input<boolean>(false);

  protected readonly connectorType = computed<NodeConnectorType>(() => {
    if (this.isLeftSideFirst()) {
      return 'left-end';
    }

    if (this.isRightSideLast()) {
      return 'right-end';
    }

    return 'intermediate';
  });
}
