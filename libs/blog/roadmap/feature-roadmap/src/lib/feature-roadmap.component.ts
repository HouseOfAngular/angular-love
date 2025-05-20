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

import { RoadmapNodeDTO } from '@angular-love/blog/contracts/roadmap';
import {
  EventType,
  RoadmapLayer,
  RoadmapLayerComponent,
  RoadmapSvgControlsComponent,
} from '@angular-love/blog/roadmap/ui-roadmap';

import { buildRoadmapLayersFromDto } from './build-roadmap-layers-from-dto';

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
    buildRoadmapLayersFromDto(this.nodesDto()),
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
