import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  RoadmapBasicNodeComponent,
  RoadmapNode,
  RoadmapStandardNode,
} from '@angular-love/blog/roadmap/ui-roadmap-node';

import { ConnectedNodesComponent } from '../connected-nodes/connected-nodes.component';
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
  imports: [
    LeftSlicePipe,
    RightSlicePipe,
    RoadmapBasicNodeComponent,
    VerticalConnectorArrowComponent,
    ConnectedNodesComponent,
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
