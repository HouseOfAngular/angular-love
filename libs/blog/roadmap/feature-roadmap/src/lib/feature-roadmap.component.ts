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
  ViewChild,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import panzoom, { PanZoom, PanZoomOptions } from 'panzoom';
import { map } from 'rxjs';

import { RoadmapNodeDTO } from '@angular-love/blog/contracts/roadmap';
import {
  EventType,
  RoadmapLayer,
  RoadmapLayerComponent,
  RoadmapPanControlsComponent,
} from '@angular-love/blog/roadmap/ui-roadmap';

import { buildRoadmapLayersFromDto } from './build-roadmap-layers-from-dto';

const panZoomInitialConfig: PanZoomOptions = {
  maxZoom: 2,
  minZoom: 0.5,
  zoomSpeed: 0.1,
  initialZoom: 1,
  smoothScroll: true,
};

@Component({
  selector: 'al-feature-roadmap',
  imports: [RoadmapLayerComponent, RoadmapPanControlsComponent],
  templateUrl: './feature-roadmap.component.html',
  styleUrl: './feature-roadmap.component.scss',
  host: {
    class: 'block h-full w-full relative',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureRoadmapComponent {
  @ViewChild('roadmapWrapper', { static: true })
  roadmapWrapper!: ElementRef<HTMLDivElement>;
  private el = inject(ElementRef<HTMLElement>);

  private readonly _platform = inject(PLATFORM_ID);
  private readonly _panZoomInitialConfig = panZoomInitialConfig;
  private readonly _scaleMultiplier = 0.5;
  private readonly _route = inject(ActivatedRoute);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(
    ElementRef<HTMLElement>,
  );

  private readonly selectedNodeId = toSignal(
    this._route.queryParams.pipe(map((params) => params['nodeId'])),
    { initialValue: undefined },
  );

  private panZoomInstance!: PanZoom;

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
    afterRenderEffect(async () => {
      if (!isPlatformBrowser(this._platform)) return;
      if (this.nodesDto()?.length) {
        console.log('afterRenderEffect');
        this.initPanZoom();
      }
    });

    afterRenderEffect(() => {
      if (!isPlatformBrowser(this._platform)) return;

      const selectedNodeId = this.selectedNodeId();

      if (selectedNodeId) this.focusSelectedNode(selectedNodeId);
    });
  }

  resizeRoadmap(event: EventType): void {
    if (!this.panZoomInstance) return;
    const currentTransform = this.panZoomInstance.getTransform();
    const wrapper = this.roadmapWrapper.nativeElement;

    if (event === 'increment') {
      const centerX = this.el.nativeElement.clientWidth / 2;
      const centerY = this.el.nativeElement.clientHeight / 2;

      console.log('window Height', window.innerHeight);
      console.log(centerY);

      const currentScale = this.panZoomInstance.getTransform().scale;
      const multiplier = currentScale + this._scaleMultiplier;

      console.log(multiplier);

      this.panZoomInstance.smoothZoom(centerX, centerY, multiplier);
    }

    if (event === 'reset') {
      this.panZoomInstance.moveTo(0, 0);
      this.panZoomInstance.zoomAbs(0, 0, 1);
    }
    if (event === 'zoom-reset') {
      this.panZoomInstance.zoomAbs(currentTransform.x, currentTransform.y, 1);
    }
    // if (event === 'decrement') svgPanZoom.zoomOut();
  }

  private focusSelectedNode(nodeId: string): void {
    if (!this.panZoomInstance) return;

    const selectedNode = this.elementRef.nativeElement.querySelector(
      `[node-id="${nodeId}"]`,
    );

    if (selectedNode) {
      const { x, y, width, height } = selectedNode.getBoundingClientRect();
      const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

      const centerX = x + width / 2 - windowWidth / 2;
      const centerY = y + height / 2 - windowHeight / 2;

      this.panZoomInstance.smoothMoveTo(-centerX, -centerY);
    }
  }

  private initPanZoom() {
    const roadmapWrapper = this.roadmapWrapper.nativeElement;
    this.panZoomInstance = panzoom(roadmapWrapper, this._panZoomInitialConfig);
    console.log(this.nodesDto());
  }
}
