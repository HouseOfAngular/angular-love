import { computed, contentChildren, Directive, input } from '@angular/core';

import {
  NodeConnectionPoint,
  NodeConnectionPointDirective,
} from './node-connection-point.directive';

const ARC_RADIUS = 12;

@Directive({
  selector: '[alNodeConnectionsGroup]',
  exportAs: 'alNodeConnectionsGroup',
})
export class NodeConnectionsGroupDirective {
  readonly direction = input<'to-left' | 'to-right'>('to-right');

  readonly connectorHeight = input<number>(40);

  private readonly _connectionPointDirectives =
    contentChildren<NodeConnectionPointDirective>(
      NodeConnectionPointDirective,
      { descendants: true },
    );

  private readonly _connectionPoints = computed<NodeConnectionPoint[]>(() =>
    this._connectionPointDirectives()
      .map((cp) => cp.nodeConnectionPoint())
      .filter((cp) => cp !== undefined),
  );

  readonly groupConnectionPath = computed<string>(() =>
    this._getNodesConnectionPath(),
  );

  private _getNodesConnectionPath(): string {
    if (!this._connectionPoints().length) {
      return '';
    }

    const sortedPoints = this._connectionPoints().sort(
      ({ offsetX: a }, { offsetX: b }) => a - b,
    );

    // Start from the center
    let path = `M 0 0 `;

    sortedPoints.forEach(({ offsetX }, index) => {
      const isLastPoint = index === sortedPoints.length - 1;
      const radius = isLastPoint ? ARC_RADIUS : 0;

      // Horizontal line to the connection point (with accounting for the eventual radius)
      path += `L ${offsetX - radius} 0 `;

      if (isLastPoint) {
        // Add arc if the last element
        path += `A ${radius} ${radius} 0 0 1 ${offsetX} ${radius} `;
      }

      // Line up from the current connection point
      path += `M ${offsetX} ${this.connectorHeight()} L ${offsetX} ${radius} `;
    });

    return path;
  }
}
