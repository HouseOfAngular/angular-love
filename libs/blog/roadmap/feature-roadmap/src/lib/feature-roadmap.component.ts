import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import {
  rxResource,
  takeUntilDestroyed,
  toSignal,
} from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import panzoom, { PanZoom, PanZoomOptions } from 'panzoom';
import { map, tap } from 'rxjs';

import {
  EventType,
  RoadmapLayer,
  RoadmapLayerComponent,
  RoadmapPanControlsComponent,
} from '@angular-love/blog/roadmap/ui-roadmap';
import { RoadmapStore } from '@angular-love/roadmap-data-access';
import { RoadmapBottomSheetNotifierService } from '@angular-love/roadmap-utils';

import { RoadmapBottomsheetManagerService } from './roadmap-bottomsheet-menager.service';

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
    class: 'block max-h-full overflow-hidden w-full relative',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RoadmapStore],
})
export class FeatureRoadmapComponent {
  @ViewChild('roadmapWrapper', { static: true })
  roadmapWrapper!: ElementRef<HTMLDivElement>;

  private readonly _roadmapStore = inject(RoadmapStore);
  private readonly _platform = inject(PLATFORM_ID);
  private readonly _panZoomInitialConfig = panZoomInitialConfig;
  private readonly _scaleMultiplier = 0.5;
  private readonly _route = inject(ActivatedRoute);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(
    ElementRef<HTMLElement>,
  );
  private readonly _roadmapBottomsheetManagerService = inject(
    RoadmapBottomsheetManagerService,
  );
  private readonly _roadmapBottomSheetNotifierService = inject(
    RoadmapBottomSheetNotifierService,
  );

  private readonly selectedNodeId = toSignal(
    this._route.queryParams.pipe(map((params) => params['nodeId'])),
    { initialValue: undefined },
  );

  private panZoomInstance = signal<PanZoom | undefined>(undefined);

  // private readonly _http = inject(HttpClient);
  // private readonly nodesDto = rxResource({
  //   loader: () =>
  //     this._http.get<RoadmapNodeDTO[]>('assets/roadmap-tiles.json', {
  //       responseType: 'json',
  //     }),
  // }).value.asReadonly();
  //
  // protected readonly roadmapLayers = computed<RoadmapLayer[]>(() =>
  //   buildRoadmapLayersFromDto(this.nodesDto()),
  // );

  private readonly nodesDto = this._roadmapStore.nodesDto;
  protected readonly roadmapLayers = this._roadmapStore.roadmapLayers;

  language = input.required<string>();

  constructor() {
    this._roadmapStore.getNodes();

    this._roadmapBottomSheetNotifierService.nodeIdAsObservable
      .pipe(
        tap((nodeId) => {
          const nodeDetails = this._roadmapStore.getNodeById(nodeId);
          if (nodeDetails)
            this._roadmapBottomsheetManagerService.open(nodeDetails);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
    afterRenderEffect(async () => {
      if (!isPlatformBrowser(this._platform)) return;
      if (this.nodesDto()?.length) {
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
    const panZoomInstance = this.panZoomInstance();
    if (!panZoomInstance) return;
    const currentTransform = panZoomInstance.getTransform();
    const centerX = this.elementRef.nativeElement.clientWidth / 2;
    const centerY = this.elementRef.nativeElement.clientHeight / 2;

    if (event === 'decrement') {
      const currentScale = currentTransform.scale;
      const multiplier =
        Math.round(currentScale * 2) / 2 - this._scaleMultiplier;

      panZoomInstance.smoothZoom(centerX, centerY, multiplier);
    }

    if (event === 'increment') {
      const currentScale = currentTransform.scale;
      const multiplier =
        Math.round(currentScale * 2) / 2 + this._scaleMultiplier;

      panZoomInstance.smoothZoom(centerX, centerY, multiplier);
    }

    if (event === 'reset') {
      panZoomInstance.moveTo(0, 0);
      panZoomInstance.zoomAbs(0, 0, 1);
    }
    if (event === 'zoom-reset') {
      panZoomInstance.zoomAbs(currentTransform.x, currentTransform.y, 1);
    }
  }

  private focusSelectedNode(nodeId: string): void {
    const panZoomInstance = this.panZoomInstance();
    if (!panZoomInstance) return;

    const selectedNode = this.elementRef.nativeElement.querySelector(
      `[node-id="${nodeId}"]`,
    );

    if (selectedNode) {
      const { x, y, width, height } = selectedNode.getBoundingClientRect();
      const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

      const centerX = x + width / 2 - windowWidth / 2;
      const centerY = y + height / 2 - windowHeight / 2;

      panZoomInstance.smoothMoveTo(-centerX, -centerY);
    }
  }

  private initPanZoom() {
    const roadmapWrapper = this.roadmapWrapper.nativeElement;
    this.panZoomInstance.set(
      panzoom(roadmapWrapper, this._panZoomInitialConfig),
    );
  }
}
