import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  RoadmapBasicNodeComponent,
  RoadmapClusterComponent,
  RoadmapNode,
} from '@angular-love/blog/roadmap/ui-roadmap-node';

import { NodeConnectionPointDirective } from './node-connection-point.directive';
import { NodeConnectionsGroupDirective } from './node-connections-group.directive';

@Component({
  selector: 'al-connected-nodes',
  templateUrl: 'connected-nodes.component.html',
  styleUrl: 'connected-nodes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NodeConnectionPointDirective,
    NodeConnectionsGroupDirective,
    RoadmapBasicNodeComponent,
    RoadmapClusterComponent,
  ],
})
export class ConnectedNodesComponent {
  readonly connectedNodes = input<RoadmapNode[]>([]);

  readonly nodesDrawingDirection = input<'to-left' | 'to-right'>('to-right');

  protected readonly connectorHeight = 40;
  protected readonly connectorStrokeWidth = 3;
}
