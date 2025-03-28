import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Edge, Node, Vflow } from 'ngx-vflow';

import { UiRoadmapNodeComponent } from './ui-roadmap-node.component';

@Component({
  selector: 'al-feature-roadmap',
  imports: [Vflow, UiRoadmapNodeComponent],
  templateUrl: './feature-roadmap.component.html',
  styleUrl: './feature-roadmap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureRoadmapComponent {
  nodes: Node[] = [
    {
      id: '1',
      point: { x: 10, y: 200 },
      type: 'html-template',
      data: {
        title: 'Node 1',
        description: 'This is node 1',
      },
    },
    {
      id: '2',
      point: { x: 200, y: 100 },
      type: 'default',
      text: '2',
    },
    {
      id: '3',
      point: { x: 200, y: 300 },
      type: 'default',
      text: '3',
    },
  ];

  edges: Edge[] = [
    {
      id: '1 -> 2',
      source: '1',
      target: '2',
    },
    {
      id: '1 -> 3',
      source: '1',
      target: '3',
    },
  ];
}
