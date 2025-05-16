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

import {
  EventType,
  RoadmapLayer,
  RoadmapLayerComponent,
  RoadmapSvgControlsComponent,
} from '@angular-love/blog/roadmap/ui-roadmap';
import {
  RoadmapClusterNode,
  RoadmapNode,
  RoadmapStandardNode,
} from '@angular-love/blog/roadmap/ui-roadmap-node';

export interface RoadmapNodeDTO {
  id: string;
  previousNodeId?: string;
  parentNodeId?: string;
  title: string;
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
  imports: [RoadmapLayerComponent, RoadmapSvgControlsComponent],
  templateUrl: './feature-roadmap.component.html',
  styleUrl: './feature-roadmap.component.scss',
  host: {
    class: 'block h-full w-full relative',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureRoadmapComponent implements AfterViewInit {
  private readonly _platform = inject(PLATFORM_ID);
  private _svgPanZoom!: SvgPanZoom.Instance;
  private readonly _svgRoadmap =
    viewChild.required<ElementRef<SVGElement>>('roadmap');

  private readonly _http = inject(HttpClient);
  private readonly nodesDto = rxResource({
    loader: () =>
      this._http.get<RoadmapNodeDTO[]>('assets/roadmap-tiles.json', {
        responseType: 'json',
      }),
  }).value.asReadonly();

  protected readonly roadmapLayers = computed<RoadmapLayer[]>(() =>
    this.buildRoadmapLayers(this.nodesDto()),
  );

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

  // TODO - maybe extract to util function and rewrite this to be more readable
  private buildRoadmapLayers(
    roadmapNodesDto: RoadmapNodeDTO[] | undefined,
  ): RoadmapLayer[] {
    if (!roadmapNodesDto) {
      return [];
    }

    const nodeDtoMap = roadmapNodesDto.reduce(
      (acc, node) => ({ ...acc, [node.id]: node }),
      {} as { [nodeId: string]: RoadmapNodeDTO },
    );
    const layerMap: { [parentNodeId: string]: string[] } = {};
    const clusterMap: { [clusterNodeId: string]: string[] } = {};
    const nodeMap: { [nodeId: string]: RoadmapNode } = {};

    roadmapNodesDto.forEach((nodeDto) => {
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

      const clusterNode = nodeMap[clusterNodeId] as RoadmapClusterNode;
      clusterNode.clusteredNodes = [];
      let nextNodeId = previousClusterNodeIdToNodeIdMap['initialNode'];
      while (nextNodeId) {
        clusterNode.clusteredNodes.push(
          nodeMap[nextNodeId] as RoadmapStandardNode,
        );
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

    const layers: RoadmapLayer[] = [];
    let nextParentNodeId = previousLayerNodeIdToNodeIdMap['initialNode'];
    while (nextParentNodeId) {
      layers.push({
        parentNode: nodeMap[nextParentNodeId] as RoadmapStandardNode,
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

  private async initSvgPanZoom() {
    const svgPanZoomModule = await import('svg-pan-zoom');
    const svgPanZoom: SvgPanZoom.Instance =
      'default' in svgPanZoomModule
        ? (svgPanZoomModule.default as SvgPanZoom.Instance)
        : svgPanZoomModule;

    this._svgPanZoom = svgPanZoom(this._svgRoadmap().nativeElement, {
      ...svgPanZoomInitialConfig,
    });
  }
}
