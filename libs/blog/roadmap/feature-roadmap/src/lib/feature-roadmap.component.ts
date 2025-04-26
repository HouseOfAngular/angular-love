import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { SecondaryArrowPipe } from './secondary-arrow.pipe';
import { LeftSlicePipe, RightSlicePipe } from './slice.pipes';
import { UiRoadmapAngularLoveNodeComponent } from './ui/ui-roadmap-angular-love-node.component';
import { UiRoadmapClusterComponent } from './ui/ui-roadmap-cluster.component';
import { UiRoadmapPrimaryNodeComponent } from './ui/ui-roadmap-primary-node.component';
import { UiRoadmapSecondaryNodeComponent } from './ui/ui-roadmap-secondary-node.component';
import { UiRoadmapSvgControlComponent } from './ui/ui-roadmap-svg-control.component';

export type NodeType = 'primary' | 'secondary' | 'cluster' | 'angular-love';

export type EventType = 'increment' | 'decrement' | 'reset' | 'zoom-reset';

export interface Control {
  size: string;
  name: string;
  event: EventType;
}

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
  clusteredNodes?: RoadmapNode[];
  nodeType: 'cluster';
}

export interface RoadmapLayer {
  parentNode: RoadmapNode;
  childNodes: RoadmapNode[];
}

const svgPanZoomInitialConfig = {
  fit: false,
  center: false,
  minZoom: 0.5,
  maxZoom: 2.5,
  zoomScaleSensitivity: 0.1,
};

@Component({
  selector: 'al-feature-roadmap',
  imports: [
    LeftSlicePipe,
    RightSlicePipe,
    UiRoadmapClusterComponent,
    UiRoadmapPrimaryNodeComponent,
    UiRoadmapAngularLoveNodeComponent,
    UiRoadmapSecondaryNodeComponent,
    UiRoadmapSvgControlComponent,
    SecondaryArrowPipe,
  ],
  templateUrl: './feature-roadmap.component.html',
  styleUrl: './feature-roadmap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureRoadmapComponent implements AfterViewInit {
  private readonly _platform = inject(PLATFORM_ID);
  private _svgPanZoom!: SvgPanZoom.Instance;
  private readonly _svgRoadmap = viewChild<ElementRef<SVGElement>>('roadmap');

  private readonly _http = inject(HttpClient);
  private readonly nodesDto = rxResource({
    loader: () =>
      this._http.get<RoadmapNodeDTO[]>('assets/roadmap-tiles.json', {
        responseType: 'json',
      }),
  }).value.asReadonly();

  protected readonly controls: Control[] = [
    {
      event: 'increment',
      size: '24',
      name: 'zoom-in',
    },
    {
      event: 'reset',
      size: '24',
      name: 'circle-center',
    },
    {
      event: 'zoom-reset',
      size: '24',
      name: 'zoom-reset',
    },
    {
      event: 'decrement',
      size: '24',
      name: 'zoom-out',
    },
  ];

  async ngAfterViewInit() {
    if (isPlatformBrowser(this._platform)) {
      await this.initSvgPanZoom();
    }
  }

  resizeRoadmap(event: EventType): void {
    if (event === 'reset') this._svgPanZoom.reset();
    if (event === 'decrement') this._svgPanZoom.zoomOut();
    if (event === 'increment') this._svgPanZoom.zoomIn();
    if (event === 'zoom-reset') this._svgPanZoom.resetZoom();
  }

  protected readonly roadmapLayers = computed<RoadmapLayer[]>(() => {
    const nodesDto = this.nodesDto();
    if (nodesDto) {
      const nodeDtoMap = nodesDto.reduce(
        (acc, node) => ({ ...acc, [node.id]: node }),
        {} as { [nodeId: string]: RoadmapNodeDTO },
      );
      const layerMap: { [parentNodeId: string]: string[] } = {};
      const clusterMap: { [clusterNodeId: string]: string[] } = {};
      const nodeMap: { [nodeId: string]: RoadmapNode } = {};

      nodesDto.forEach((nodeDto) => {
        if (nodeDto.parentNodeId) {
          if (nodeDtoMap[nodeDto.parentNodeId].parentNodeId) {
            const parentClusterNodeDto = nodeDtoMap[nodeDto.parentNodeId];

            clusterMap[parentClusterNodeDto.id] = [
              ...(clusterMap[parentClusterNodeDto.id] ?? []),
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

      // setup clusters
      Object.entries(clusterMap).forEach(([clusterNodeId, childrenNodeIds]) => {
        const previousClusterNodeIdToNodeIdMap = childrenNodeIds.reduce(
          (acc, primaryNodeId) => ({
            ...acc,
            [nodeDtoMap[primaryNodeId].previousNodeId || 'initialNode']:
              primaryNodeId,
          }),
          {} as { [previousNodeId: string | 'initialNode']: string },
        );

        const clusterNode = nodeMap[clusterNodeId] as RoadmapCluster;
        clusterNode.clusteredNodes = [];
        let nextNodeId = previousClusterNodeIdToNodeIdMap['initialNode'];
        while (nextNodeId) {
          clusterNode.clusteredNodes.push(nodeMap[nextNodeId]);
          nextNodeId = previousClusterNodeIdToNodeIdMap[nextNodeId];
        }
      });

      // setup layers
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
    }
    return [];
  });

  private async initSvgPanZoom() {
    const svgPanZoomModule = await import('svg-pan-zoom');
    const svgPanZoom: SvgPanZoom.Instance =
      (svgPanZoomModule as any)['default'] || svgPanZoomModule;

    const svgRoadmap = this._svgRoadmap();
    if (svgRoadmap) {
      this._svgPanZoom = svgPanZoom(svgRoadmap.nativeElement, {
        ...svgPanZoomInitialConfig,
      });
    }
  }
}
