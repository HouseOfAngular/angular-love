import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { LeftSlicePipe, RightSlicePipe } from './slice.pipes';
import { SvgPathComponent } from './temp.component';
import { UiRoadmapNodeComponent } from './ui-roadmap-node.component';

export type NodeType = 'primary' | 'secondary' | 'cluster' | 'angular-love';

export interface RoadmapNodeDTO {
  id: string;
  previousNodeId?: string;
  parentNodeId?: string;
  title: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  nodeType: NodeType;
}

export interface RoadmapCluster extends RoadmapNode {
  clusteredNodes?: NodeType[];
  nodeType: 'cluster';
}

export interface RoadmapRootNode extends RoadmapNode {
  nodeType: 'angular-love';
}

export interface RoadmapLayer {
  parentNode: RoadmapNode;
  childNodes: RoadmapNode[];
}

@Component({
  selector: 'al-feature-roadmap',
  imports: [
    SvgPathComponent,
    UiRoadmapNodeComponent,
    LeftSlicePipe,
    RightSlicePipe,
  ],
  templateUrl: './feature-roadmap.component.html',
  styleUrl: './feature-roadmap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureRoadmapComponent {
  private readonly nodesDto = signal<RoadmapNodeDTO[]>([
    {
      id: '2',
      title: 'Components',
    },
    {
      id: '3',
      parentNodeId: '2',
      title: 'Change Detection',
    },
    {
      id: '4',
      parentNodeId: '2',
      title: 'Styling',
    },
  ]);

  protected readonly roadmapLayers = computed<RoadmapLayer[]>(() => {
    const nodeDtoMap = this.nodesDto().reduce(
      (acc, node) => ({ ...acc, [node.id]: node }),
      {} as { [nodeId: string]: RoadmapNodeDTO },
    );
    const layerMap: { [parentNodeId: string]: string[] } = {};
    const clusterMap: { [clusterNodeId: string]: string[] } = {};
    const nodeMap: { [nodeId: string]: RoadmapNode } = {};

    this.nodesDto().forEach((nodeDto) => {
      if (nodeDto.parentNodeId) {
        if (nodeDtoMap[nodeDto.parentNodeId].parentNodeId) {
          const parentClusterNodeDto = nodeDtoMap[nodeDto.parentNodeId];

          clusterMap[parentClusterNodeDto.id] = [
            ...clusterMap[parentClusterNodeDto.id],
            nodeDto.id,
          ];

          if (nodeMap[nodeDto.parentNodeId]) {
            nodeMap[parentClusterNodeDto.id].nodeType = 'cluster';
          } else {
            nodeMap[parentClusterNodeDto.id] = {
              id: parentClusterNodeDto.id,
              nodeType: 'cluster',
              title: parentClusterNodeDto.title,
            };
          }
        } else {
          layerMap[nodeDto.parentNodeId] = [
            ...(layerMap[nodeDto.parentNodeId] ?? []),
            nodeDto.id,
          ];
        }
        if (!nodeMap[nodeDto.id]) {
          nodeMap[nodeDto.id] = {
            id: nodeDto.id,
            nodeType: 'secondary',
            title: nodeDto.title,
          };
        }
      } else {
        nodeMap[nodeDto.id] = {
          id: nodeDto.id,
          nodeType: 'primary',
          title: nodeDto.title,
        };
        if (!layerMap[nodeDto.id]) {
          layerMap[nodeDto.id] = [];
        }
      }
    });

    const previousLayerNodeIdToNodeIdMap = Object.keys(layerMap).reduce(
      (acc, primaryNodeId) => ({
        ...acc,
        [nodeDtoMap[primaryNodeId].previousNodeId || 'initialNode']:
          primaryNodeId,
      }),
      {} as { [previousNodeId: string | 'initialNode']: string },
    );

    const layers: {
      parentNode: RoadmapNode;
      childNodes: RoadmapNode[];
    }[] = [];
    let nextParentNodeId = previousLayerNodeIdToNodeIdMap['initialNode'];
    while (nextParentNodeId) {
      layers.push({
        parentNode: nodeMap[nextParentNodeId],
        childNodes: layerMap[nextParentNodeId].map(
          (childrenNodeId) => nodeMap[childrenNodeId],
        ),
      });
      nextParentNodeId = previousLayerNodeIdToNodeIdMap[nextParentNodeId];
    }

    return [
      {
        parentNode: {
          id: '1',
          title: 'Angular.Love Roadmap Introduction',
          nodeType: 'angular-love',
        },
        childNodes: [],
      },
      ...layers,
    ];
  });
}
