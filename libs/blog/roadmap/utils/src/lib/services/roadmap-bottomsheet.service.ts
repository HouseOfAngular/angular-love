import { computed, Injectable, signal } from '@angular/core';

import { AngularLoveNode, NodeDetails, RegularNode } from '../models';

function isAngularNode(node: NodeDetails): node is AngularLoveNode {
  return node.nodeType === 'angular-love';
}

function isRegularNode(node: NodeDetails): node is RegularNode {
  return node.nodeType === 'regular';
}

@Injectable({
  providedIn: 'root',
})
export class RoadmapBottomsheetService {
  private readonly _nodeDetails = signal<NodeDetails | undefined>(undefined);

  readonly nodeDetails = computed(() => this._nodeDetails());

  readonly angularLoveNodeDetails = computed<AngularLoveNode | undefined>(
    () => {
      const details = this._nodeDetails();
      return details && isAngularNode(details) ? details : undefined;
    },
  );

  readonly regularNodeDetails = computed<RegularNode | undefined>(() => {
    const details = this._nodeDetails();
    return details && isRegularNode(details) ? details : undefined;
  });

  open(nodeDetails: NodeDetails) {
    this._nodeDetails.set(nodeDetails);
  }

  close() {
    this._nodeDetails.set(undefined);
  }
}
