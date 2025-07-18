import { isPlatformBrowser } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import panzoom, { PanZoom, PanZoomOptions } from 'panzoom';
import { map, tap } from 'rxjs';

import {
  EventType,
  RoadmapLayerComponent,
  RoadmapLegendComponent,
  RoadmapPanControlsComponent,
} from '@angular-love/blog/roadmap/ui-roadmap';
import {
  RoadmapBottomSheetNotifierService,
  RoadmapStandardNode,
} from '@angular-love/blog/roadmap/ui-roadmap-node';
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
  imports: [
    RoadmapLayerComponent,
    RoadmapPanControlsComponent,
    RoadmapLegendComponent,
  ],
  templateUrl: './feature-roadmap.component.html',
  styles: `
    :host {
      animation: fadeIn 0.35s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  host: {
    class: 'block max-h-full overflow-hidden w-full relative',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RoadmapStore],
})
export class FeatureRoadmapComponent {
  private readonly _roadmapWrapper =
    viewChild.required<ElementRef<HTMLDivElement>>('roadmapWrapper');
  private readonly _roadmapStore = inject(RoadmapStore);
  private readonly _platform = inject(PLATFORM_ID);
  private readonly _panZoomInitialConfig = panZoomInitialConfig;
  private readonly _scaleMultiplier = 0.5;
  private readonly _correctionTime = 350;
  private readonly _route = inject(ActivatedRoute);
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(
    ElementRef<HTMLElement>,
  );
  private readonly _roadmapBottomsheetManagerService = inject(
    RoadmapBottomsheetManagerService,
  );
  private readonly _roadmapBottomSheetNotifierService = inject(
    RoadmapBottomSheetNotifierService,
  );
  private readonly _selectedNodeId = toSignal(
    this._route.queryParams.pipe(map((params) => params['nodeId'])),
    { initialValue: undefined },
  );

  private _panZoomInstance = signal<PanZoom | undefined>(undefined);
  private readonly _nodesDto = this._roadmapStore.nodesDto;
  protected readonly roadmapLayers = this._roadmapStore.roadmapLayers;
  protected readonly isPlatformBrowser = isPlatformBrowser(this._platform);

  language = input.required<string>();

  constructor() {
    this._roadmapStore.getNodes();

    this._roadmapBottomSheetNotifierService.focusedNodeAsObservable
      .pipe(
        tap(({ id }: RoadmapStandardNode) => {
          this.focusSelectedNode(id);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();

    this._roadmapBottomSheetNotifierService.nodeAsObservable
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
      if (this._nodesDto()?.length) {
        this.initPanZoom();
      }
    });

    afterRenderEffect(() => {
      if (!isPlatformBrowser(this._platform)) return;

      const selectedNodeId = this._selectedNodeId();
      if (selectedNodeId) this.clickSelectedNode(selectedNodeId);
    });
  }

  clickSelectedNode(selectedNodeId: string) {
    const selectedNode = this._elementRef.nativeElement.querySelector(
      `[node-id="${selectedNodeId}"]`,
    ) as HTMLElement | null;

    selectedNode?.dispatchEvent(new PointerEvent('pointerup'));
  }

  resizeRoadmap(event: EventType): void {
    const panZoomInstance = this._panZoomInstance();
    if (!panZoomInstance) return;
    const transform = panZoomInstance.getTransform();
    const centerX = this._elementRef.nativeElement.clientWidth / 2;
    const centerY = this._elementRef.nativeElement.clientHeight / 2;

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
    const panZoomInstance = this._panZoomInstance();
    if (!panZoomInstance) return;

    const selectedNode = this._elementRef.nativeElement.querySelector(
      `[node-id="${nodeId}"]`,
    ) as HTMLElement | null;

    if (!selectedNode) return;
    const nodeRect = selectedNode.getBoundingClientRect();
    const containerRect =
      this._elementRef.nativeElement.getBoundingClientRect();

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
  }

  private initPanZoom() {
    const roadmapWrapper = this._roadmapWrapper().nativeElement;
    this._panZoomInstance.set(
      panzoom(roadmapWrapper, {
        ...this._panZoomInitialConfig,
        beforeWheel: function (e) {
          return true;
        },
      }),
    );

    const _panZoomInstance = this._panZoomInstance();
    const { bottommostNode, topmostNode, rightmostNode, leftmostNode } =
      this.getRoadmapBounds();

    window.addEventListener('wheel', this.handleWheelEvent, { passive: true });

    _panZoomInstance?.on('panend', () => {
      if (!bottommostNode || !topmostNode || !rightmostNode || !leftmostNode)
        return;

      const correctPosition = () => {
        const lowerNodeRect = bottommostNode.getBoundingClientRect();
        const topNodeRect = topmostNode.getBoundingClientRect();
        const rightNodeRect = rightmostNode.getBoundingClientRect();
        const leftNodeRect = leftmostNode?.getBoundingClientRect();

        const viewportCenterY = window.innerHeight / 2;
        const viewportCenterX = window.innerWidth / 2;

        if (lowerNodeRect.top < 100) {
          const nodeCenterY = lowerNodeRect.top + lowerNodeRect.height / 2;
          const deltaY = viewportCenterY - nodeCenterY;

          this.correctPanBy(_panZoomInstance, 0, deltaY);
        }
        if (topNodeRect.bottom > window.innerHeight - 100) {
          const nodeCenterY = topNodeRect.bottom + topNodeRect.height / 2;
          const deltaY = viewportCenterY - nodeCenterY;

          this.correctPanBy(_panZoomInstance, 0, deltaY);
        }

        if (leftNodeRect.left > window.innerWidth - 100) {
          const nodeCenterX = leftNodeRect.left + leftNodeRect.width / 2;
          const deltaX = viewportCenterX - nodeCenterX;

          this.correctPanBy(_panZoomInstance, deltaX, 0);
        }

        if (rightNodeRect.right < 100) {
          const nodeCenterX = rightNodeRect.right + rightNodeRect.width / 2;
          const deltaX = viewportCenterX - nodeCenterX;

          this.correctPanBy(_panZoomInstance, deltaX, 0);
        }
      };

      setTimeout(() => {
        correctPosition();
      }, this._correctionTime);
    });

    this.disableButtonsEventPropagation();
  }

  private disableDefaultScrollBehaviour(
    e: WheelEvent,
    panZoom: PanZoom,
    bottommostNode: HTMLElement,
    topmostNode: HTMLElement,
  ) {
    const transforms = panZoom.getTransform();
    const lowerNodeRect = bottommostNode.getBoundingClientRect();
    const topNodeRect = topmostNode.getBoundingClientRect();
    const viewportCenterY = window.innerHeight / 2;

    if (transforms) {
      if (lowerNodeRect && lowerNodeRect.top < 100) {
        const nodeCenterY = lowerNodeRect.top + lowerNodeRect.height / 2;
        const deltaY = viewportCenterY - nodeCenterY;
        return this.correctPanBy(panZoom, 0, deltaY);
      }

      if (topNodeRect && topNodeRect.bottom > window.innerHeight - 100) {
        const nodeCenterY = topNodeRect.bottom + topNodeRect.height / 2;
        const deltaY = viewportCenterY - nodeCenterY;
        return this.correctPanBy(panZoom, 0, deltaY);
      }

      panZoom.moveTo(transforms.x - e.deltaX, transforms.y - e.deltaY);
    }
  }

  private getRoadmapBounds(): {
    bottommostNode: HTMLElement | null;
    topmostNode: HTMLElement | null;
    leftmostNode: HTMLElement | null;
    rightmostNode: HTMLElement | null;
  } {
    const nodes = this._elementRef.nativeElement.querySelectorAll(
      '[node-id]',
    ) as NodeListOf<HTMLElement>;

    let topmostNode: HTMLElement | null = null;
    let bottommostNode: HTMLElement | null = null;
    let leftmostNode: HTMLElement | null = null;
    let rightmostNode: HTMLElement | null = null;

    let minX: number | null = null;
    let maxX: number | null = null;
    let minY: number | null = null;
    let maxY: number | null = null;

    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const parentRect = this._elementRef.nativeElement.getBoundingClientRect();
      const x = rect.left - parentRect.left;
      const y = rect.top - parentRect.top;

      if (minX === null || x < minX) {
        minX = x;
        leftmostNode = node;
      }

      if (maxX === null || x + rect.width > maxX) {
        maxX = x + rect.width;
        rightmostNode = node;
      }

      if (minY === null || y < minY) {
        minY = y;
        topmostNode = node;
      }

      if (maxY === null || y + rect.height > maxY) {
        maxY = y + rect.height;
        bottommostNode = node;
      }
    });

    return {
      topmostNode,
      bottommostNode,
      leftmostNode,
      rightmostNode,
    };
  }

  private disableButtonsEventPropagation() {
    const legendButton = document.querySelector('al-roadmap-legend button');
    const controlButtons = document.querySelectorAll(
      'al-roadmap-pan-controls button',
    );

    controlButtons.forEach((btn) => {
      btn.addEventListener('pointerdown', () => {
        this._panZoomInstance()?.pause();
      });

      btn.addEventListener('click', () => {
        setTimeout(() => this._panZoomInstance()?.resume(), 0);
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

    if (legendButton) {
      legendButton.addEventListener('pointerdown', () => {
        this._panZoomInstance()?.pause();
      });

      legendButton.addEventListener('click', () => {
        setTimeout(() => this._panZoomInstance()?.resume(), 0);
      });

      legendButton.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        { passive: false },
      );
    }
  }

  private handleWheelEvent = (e: WheelEvent) => {
    const panZoom = this._panZoomInstance();
    const { topmostNode, bottommostNode } = this.getRoadmapBounds();
    if (panZoom && bottommostNode && topmostNode) {
      this.disableDefaultScrollBehaviour(
        e,
        panZoom,
        bottommostNode,
        topmostNode,
      );
    }
  };

  private correctPanBy(
    panZoomInstance: PanZoom,
    deltaX: number,
    deltaY: number,
  ) {
    panZoomInstance.pause();
    panZoomInstance.moveBy(deltaX, deltaY, true);
    panZoomInstance.resume();
  }
}
