import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  RoadmapAngularLoveNodeComponent,
  RoadmapClusterComponent,
  RoadmapNode,
  RoadmapPrimaryNodeComponent,
  RoadmapSecondaryNodeComponent,
  RoadmapStandardNode,
} from '@angular-love/blog/roadmap/ui-roadmap-node';

import { ConnectedNodeComponent } from '../connected-node/connected-node.component';
import { NodeConnectorLineComponent } from '../node-connector-line/node-connector-line.component';
import { VerticalConnectorArrowComponent } from '../vertical-connector-arrow/vertical-connector-arrow.component';

import { LeftSlicePipe } from './left-slice.pipe';
import { RightSlicePipe } from './right-slice.pipe';

export interface RoadmapLayer {
  parentNode: RoadmapStandardNode;
  childNodes: RoadmapNode[];
}

@Component({
  selector: 'al-roadmap-layer',
  templateUrl: 'roadmap-layer.component.html',
  styleUrl: 'roadmap-layer.component.scss',
  imports: [
    LeftSlicePipe,
    RightSlicePipe,
    RoadmapClusterComponent,
    RoadmapPrimaryNodeComponent,
    RoadmapAngularLoveNodeComponent,
    RoadmapSecondaryNodeComponent,
    ConnectedNodeComponent,
    VerticalConnectorArrowComponent,
    NodeConnectorLineComponent,
  ],
  host: {
    class: 'flex w-full flex-col items-center relative gap-12 pb-16',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadmapLayerComponent {
  readonly layer = input.required<RoadmapLayer>();

  readonly showLayerConnector = input<boolean>(false);
}
