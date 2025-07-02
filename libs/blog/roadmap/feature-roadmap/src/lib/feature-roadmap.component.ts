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
import { RoadmapBottomSheetNotifierService } from '@angular-love/blog/roadmap/ui-roadmap-node';
import { RoadmapStore } from '@angular-love/roadmap-data-access';

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

  private readonly nodesDto = this._roadmapStore.nodesDto;
  protected readonly roadmapLayers = this._roadmapStore.roadmapLayers;

  language = input.required<string>();

  constructor() {
    this._roadmapStore.getNodes();

    this._roadmapBottomSheetNotifierService.nodeIdAsObservable
      .pipe(
        tap((node) => {
          this.focusSelectedNode(node.id);
          this._roadmapBottomsheetManagerService.open(node);
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

      if (selectedNodeId) this.clickSelectedNode(selectedNodeId);
    });
  }

  clickSelectedNode(selectedNodeId: string) {
    const selectedNode = this.elementRef.nativeElement.querySelector(
      `[node-id="${selectedNodeId}"]`,
    ) as HTMLElement | null;

    console.log('SELECTED NODE', selectedNode, selectedNodeId);
    setTimeout(() => {
      selectedNode?.dispatchEvent(new PointerEvent('pointerup'));
    }, 0);
  }

  resizeRoadmap(event: EventType): void {
    const panZoomInstance = this.panZoomInstance();
    if (!panZoomInstance) return;
    const transform = panZoomInstance.getTransform();
    const centerX = this.elementRef.nativeElement.clientWidth / 2;
    const centerY = this.elementRef.nativeElement.clientHeight / 2;

    const currentScale = transform.scale;
    let targetScale = currentScale;

    if (event === 'increment') {
      targetScale = Math.min(
        currentScale + this._scaleMultiplier,
        this._panZoomInitialConfig.maxZoom ?? 2,
      );
    } else if (event === 'decrement') {
      targetScale = Math.max(
        currentScale - this._scaleMultiplier,
        this._panZoomInitialConfig.minZoom ?? 0.5,
      );
    } else if (event === 'reset') {
      panZoomInstance.moveTo(0, 0);
      panZoomInstance.zoomAbs(0, 0, 1);
      return;
    } else if (event === 'zoom-reset') {
      panZoomInstance.zoomAbs(centerX, centerY, 1);
      return;
    }

    const zoomFactor = targetScale / currentScale;

    panZoomInstance.smoothZoom(centerX, centerY, zoomFactor);
  }

  private focusSelectedNode(nodeId: string): void {
    const panZoomInstance = this.panZoomInstance();
    if (!panZoomInstance) return;

    const selectedNode = this.elementRef.nativeElement.querySelector(
      `[node-id="${nodeId}"]`,
    ) as HTMLElement | null;

    if (!selectedNode) return;
    const nodeRect = selectedNode.getBoundingClientRect();
    const containerRect = this.elementRef.nativeElement.getBoundingClientRect();

    const nodeCenterX = nodeRect.left + nodeRect.width / 2;
    const nodeCenterY = nodeRect.top + nodeRect.height / 2;

    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;

    const deltaX = nodeCenterX - containerCenterX;
    const deltaY = nodeCenterY - containerCenterY;

    const transform = panZoomInstance.getTransform();

    const targetX = transform.x - deltaX;
    const targetY = transform.y - deltaY;

    panZoomInstance.smoothMoveTo(targetX, targetY);

    // console.log(selectedNode);
    // selectedNode.click();

    // const nodeDetails = this._roadmapStore.getNodeById(nodeId);
    // if (nodeDetails) {
    // }
  }

  private initPanZoom() {
    const roadmapWrapper = this.roadmapWrapper.nativeElement;
    this.panZoomInstance.set(
      panzoom(roadmapWrapper, this._panZoomInitialConfig),
    );

    const controlButtons = document.querySelectorAll(
      'al-roadmap-pan-controls button',
    );

    controlButtons.forEach((btn) => {
      btn.addEventListener('pointerdown', () => {
        this.panZoomInstance()?.pause();
      });

      btn.addEventListener('click', () => {
        setTimeout(() => this.panZoomInstance()?.resume(), 0);
      });

      btn.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        { passive: false },
      );
    });
  }
}
