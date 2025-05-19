import {
  computed,
  Directive,
  input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

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

  private readonly _connectionPointDirectives: WritableSignal<
    NodeConnectionPointDirective[]
  > = signal([]);

  private readonly connectionPoints: Signal<NodeConnectionPoint[]> = computed(
    () =>
      this._connectionPointDirectives()
        .map((cp) => cp.nodeConnectionPoint())
        .filter((cp) => cp !== undefined),
  );

  readonly groupConnectionPath: Signal<string> = computed(() =>
    this.getNodesConnectionPath(),
  );

  registerConnectionPointDirective(
    connectionPointDirective: NodeConnectionPointDirective,
  ) {
    this._connectionPointDirectives.set([
      ...this._connectionPointDirectives(),
      connectionPointDirective,
    ]);
  }

  unregisterConnectionPointDirective(
    connectionPointDirective: NodeConnectionPointDirective,
  ) {
    this._connectionPointDirectives.set(
      this._connectionPointDirectives().filter(
        (cpd) => cpd !== connectionPointDirective,
      ),
    );
  }

  private getNodesConnectionPath(): string {
    if (!this.connectionPoints().length) {
      return '';
    }

    const directionModifier = this.direction() === 'to-left' ? -1 : 1;
    const sortedPoints = this.connectionPoints().sort(
      ({ offsetX: a }, { offsetX: b }) => directionModifier * (a - b),
    );

    // Start from the center
    let path = `M 0 0 `;

    sortedPoints.forEach(({ offsetX }, index) => {
      const isLastPoint = index === sortedPoints.length - 1;
      const radius = isLastPoint ? ARC_RADIUS : 0;

      // Horizontal line to the connection point (with accounting for the eventual radius)
      const radiusOffset = offsetX > 0 ? -radius : radius;
      path += `L ${offsetX + radiusOffset} 0 `;

      if (isLastPoint) {
        // Add arc if the last element
        path += `A ${radius} ${radius} 0 0 ${this.direction() === 'to-left' ? 0 : 1} ${offsetX} ${radius} `;
      }

      // Line up from the current connection point
      path += `M ${offsetX} ${this.connectorHeight()} L ${offsetX} ${radius} `;
    });

    return path;
  }
}
