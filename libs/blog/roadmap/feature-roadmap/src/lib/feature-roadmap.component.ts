import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  afterNextRender,
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

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
export class FeatureRoadmapComponent {
  private readonly _platform = inject(PLATFORM_ID);
  private readonly route = inject(ActivatedRoute);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(
    ElementRef<HTMLElement>,
  );

  private readonly selectedNodeId = toSignal(
    this.route.queryParams.pipe(map((params) => params['nodeId'])),
    { initialValue: undefined },
  );

  private readonly svgPanZoom = signal<SvgPanZoom.Instance | undefined>(
    undefined,
  );

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

  constructor() {
    afterNextRender(async () => {
      if (isPlatformBrowser(this._platform)) {
        await this.initSvgPanZoom();
      }
    });

    afterRenderEffect(() => {
      if (!isPlatformBrowser(this._platform)) {
        return;
      }

      const selectedNodeId = this.selectedNodeId();

      if (selectedNodeId) {
        this.focusSelectedNode(selectedNodeId);
      }
    });
  }

  resizeRoadmap(event: EventType): void {
    const svgPanZoom = this.svgPanZoom();

    if (!svgPanZoom) {
      return;
    }

    if (event === 'reset') svgPanZoom.reset();
    if (event === 'decrement') svgPanZoom.zoomOut();
    if (event === 'increment') svgPanZoom.zoomIn();
    if (event === 'zoom-reset') svgPanZoom.resetZoom();
  }

  private focusSelectedNode(nodeId: string): void {
    const svgPanZoom = this.svgPanZoom();

    if (!svgPanZoom) {
      return;
    }

    const selectedNode = this.elementRef.nativeElement.querySelector(
      `[node-id="${nodeId}"]`,
    );

    if (selectedNode) {
      const { x, y, width, height } = selectedNode.getBoundingClientRect();
      const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

      const centerX = x + width / 2 - windowWidth / 2;
      const centerY = y + height / 2 - windowHeight / 2;

      svgPanZoom.pan({ x: -centerX, y: -centerY });
    }
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

    const svgPanZoomInstance = svgPanZoom(this._svgRoadmap().nativeElement, {
      ...svgPanZoomInitialConfig,
    });
    this.svgPanZoom.set(svgPanZoomInstance);
  }
}
