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
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import panzoom, { PanZoom } from 'panzoom';
import { map, switchMap, tap } from 'rxjs';

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

import { panZoomInitialConfig } from './pan-zoom-initial-config';
import { PanZoomService } from './pan-zoom.service';
import { RoadmapBottomsheetManagerService } from './roadmap-bottomsheet-menager.service';

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
  private readonly _panZoomService = inject(PanZoomService);
  private readonly _nodesDto = this._roadmapStore.nodesDto;
  protected readonly roadmapLayers = this._roadmapStore.roadmapLayers;
  protected readonly isPlatformBrowser = isPlatformBrowser(this._platform);

  readonly language = input.required<string>();

  constructor() {
    this._roadmapStore.getNodes();

    this._roadmapBottomSheetNotifierService.focusedNodeAsObservable
      .pipe(
        tap(({ id }: RoadmapStandardNode) => {
          if (this._panZoomInstance()) {
            this._panZoomService.focusSelectedNode(
              id,
              this._panZoomInstance()!,
              this._elementRef,
            );
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe();

    this._roadmapBottomSheetNotifierService.nodeAsObservable
      .pipe(
        tap(({ id }) => {
          if (this._panZoomInstance()) {
            this._panZoomService.focusSelectedNode(
              id,
              this._panZoomInstance()!,
              this._elementRef,
            );
          }
          this.removeWheelListener();
        }),
        switchMap((node) => this._roadmapBottomsheetManagerService.open(node)),
        tap(() => {
          this.appendWheelListener();
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
      const nodes = this._nodesDto();
      if (selectedNodeId && nodes?.length)
        this._panZoomService.centerSelectedNode(
          selectedNodeId,
          this._elementRef,
        );
    });
  }

  protected resizeRoadmap(event: EventType): void {
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
      this._panZoomService.getRoadmapBounds(this._elementRef);

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

          this._panZoomService.correctPanBy(_panZoomInstance, 0, deltaY);
        }
        if (topNodeRect.bottom > window.innerHeight - 100) {
          const nodeCenterY = topNodeRect.bottom + topNodeRect.height / 2;
          const deltaY = viewportCenterY - nodeCenterY;

          this._panZoomService.correctPanBy(_panZoomInstance, 0, deltaY);
        }

        if (leftNodeRect.left > window.innerWidth - 100) {
          const nodeCenterX = leftNodeRect.left + leftNodeRect.width / 2;
          const deltaX = viewportCenterX - nodeCenterX;

          this._panZoomService.correctPanBy(_panZoomInstance, deltaX, 0);
        }

        if (rightNodeRect.right < 100) {
          const nodeCenterX = rightNodeRect.right + rightNodeRect.width / 2;
          const deltaX = viewportCenterX - nodeCenterX;

          this._panZoomService.correctPanBy(_panZoomInstance, deltaX, 0);
        }
      };

      setTimeout(() => {
        correctPosition();
      }, this._correctionTime);
    });

    if (_panZoomInstance) {
      this._panZoomService.disableButtonsEventPropagation(_panZoomInstance);
    }
    this.appendWheelListener();
  }

  private handleWheelEvent = (e: WheelEvent) => {
    const panZoom = this._panZoomInstance();
    const { topmostNode, bottommostNode } =
      this._panZoomService.getRoadmapBounds(this._elementRef);
    if (panZoom && bottommostNode && topmostNode) {
      this._panZoomService.disableDefaultScrollBehaviour(
        e,
        panZoom,
        bottommostNode,
        topmostNode,
      );
    }
  };

  private appendWheelListener() {
    window.addEventListener('wheel', this.handleWheelEvent, { passive: true });
  }

  private removeWheelListener() {
    window.removeEventListener('wheel', this.handleWheelEvent);
  }
}
