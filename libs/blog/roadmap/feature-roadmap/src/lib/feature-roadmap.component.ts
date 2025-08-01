import { isPlatformBrowser } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import panzoom, { PanZoom } from 'panzoom';
import { switchMap, tap } from 'rxjs';

import {
  EventType,
  RoadmapLayerComponent,
  RoadmapPanControlsComponent,
} from '@angular-love/blog/roadmap/ui-roadmap';
import {
  RoadmapDialogNotifierService,
  RoadmapStandardNode,
} from '@angular-love/blog/roadmap/ui-roadmap-node';
import { RoadmapStore } from '@angular-love/roadmap/data-access';

import { panZoomInitialConfig } from './pan-zoom-initial-config';
import { PanZoomService } from './pan-zoom.service';
import { RoadmapDialogManagerService } from './roadmap-dialog-manager.service';

@Component({
  selector: 'al-feature-roadmap',
  templateUrl: './feature-roadmap.component.html',
  styleUrl: './feature-roadmap.component.scss',
  providers: [RoadmapStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RoadmapLayerComponent, RoadmapPanControlsComponent],
  host: {
    class: 'block max-h-full overflow-hidden w-full relative',
  },
})
export class FeatureRoadmapComponent implements OnDestroy {
  private readonly _roadmapWrapper =
    viewChild.required<ElementRef<HTMLDivElement>>('roadmapWrapper');
  private readonly _roadmapStore = inject(RoadmapStore);
  private readonly _platform = inject(PLATFORM_ID);
  private readonly _panZoomService = inject(PanZoomService);
  private readonly _roadmapDialogManagerService = inject(
    RoadmapDialogManagerService,
  );
  private readonly _roadmapDialogNotifierService = inject(
    RoadmapDialogNotifierService,
  );
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(
    ElementRef<HTMLElement>,
  );
  private readonly _panZoomInitialConfig = panZoomInitialConfig;
  private readonly _scaleMultiplier = 0.5;
  private readonly _correctionTime = 350;
  private _panZoomInstance = signal<PanZoom | undefined>(undefined);
  private readonly _nodesDto = this._roadmapStore.nodesDtos;
  private readonly _transformMargin = 200;

  protected readonly roadmapLayers = this._roadmapStore.roadmapLayers;
  protected readonly isPlatformBrowser = isPlatformBrowser(this._platform);
  protected readonly nodeId = input<string | undefined>(undefined);

  constructor() {
    this._roadmapStore.getNodes();

    this._roadmapDialogNotifierService.nodeFocused$
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

    this._roadmapDialogNotifierService.nodeClicked$
      .pipe(
        tap(({ id }) => {
          if (this._panZoomInstance()) {
            this._panZoomService.focusSelectedNode(
              id,
              this._panZoomInstance()!,
              this._elementRef,
            );
          }
          this._removeWheelListener();
        }),
        switchMap((node) => this._roadmapDialogManagerService.open(node)),
        tap(() => this._appendWheelListener()),
        takeUntilDestroyed(),
      )
      .subscribe();

    afterRenderEffect(async () => {
      if (this._nodesDto()?.length) {
        this._initPanZoom();
      }
    });

    afterRenderEffect(() => {
      const nodeId = this.nodeId();
      const nodes = this._nodesDto();
      if (nodeId && nodes?.length)
        this._panZoomService.clickOnNode(nodeId, this._elementRef);
    });
  }

  ngOnDestroy() {
    if (this.isPlatformBrowser) this._removeWheelListener();
  }

  pausePanZoom() {
    this._panZoomInstance()?.pause();
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
      this._resumePanZoom();
      return;
    } else if (event === 'zoom-reset') {
      panZoomInstance.zoomAbs(centerX, centerY, 1);
      this._resumePanZoom();
      return;
    }

    const zoomFactor = targetScale / currentScale;
    panZoomInstance.smoothZoom(centerX, centerY, zoomFactor);
    this._resumePanZoom();
  }

  private _initPanZoom() {
    const roadmapWrapper = this._roadmapWrapper().nativeElement;
    const _panZoomInstance = panzoom(roadmapWrapper, {
      ...this._panZoomInitialConfig,
      beforeWheel: function (e) {
        return true;
      },
    });

    this._panZoomInstance.set(_panZoomInstance);

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

        if (lowerNodeRect.top < this._transformMargin) {
          const nodeCenterY = lowerNodeRect.top + lowerNodeRect.height / 2;
          const deltaY = viewportCenterY - nodeCenterY;

          this._panZoomService.correctPanBy(_panZoomInstance, 0, deltaY);
        }
        if (topNodeRect.bottom > window.innerHeight - this._transformMargin) {
          const nodeCenterY = topNodeRect.bottom + topNodeRect.height / 2;
          const deltaY = viewportCenterY - nodeCenterY;

          this._panZoomService.correctPanBy(_panZoomInstance, 0, deltaY);
        }

        if (leftNodeRect.left > window.innerWidth - this._transformMargin) {
          const nodeCenterX = leftNodeRect.left + leftNodeRect.width / 2;
          const deltaX = viewportCenterX - nodeCenterX;

          this._panZoomService.correctPanBy(_panZoomInstance, deltaX, 0);
        }

        if (rightNodeRect.right < this._transformMargin) {
          const nodeCenterX = rightNodeRect.right + rightNodeRect.width / 2;
          const deltaX = viewportCenterX - nodeCenterX;

          this._panZoomService.correctPanBy(_panZoomInstance, deltaX, 0);
        }
      };

      setTimeout(() => {
        correctPosition();
      }, this._correctionTime);
    });

    this._appendWheelListener();
  }

  private _handleWheelEvent = (e: WheelEvent) => {
    const panZoom = this._panZoomInstance();
    const { topmostNode, bottommostNode } =
      this._panZoomService.getRoadmapBounds(this._elementRef);
    if (panZoom && bottommostNode && topmostNode) {
      this._panZoomService.handleRoadmapScrollBounds(
        e,
        panZoom,
        bottommostNode,
        topmostNode,
      );
    }
  };

  private _appendWheelListener() {
    window.addEventListener('wheel', this._handleWheelEvent, { passive: true });
  }

  private _removeWheelListener() {
    window.removeEventListener('wheel', this._handleWheelEvent);
  }

  private _resumePanZoom() {
    this._panZoomInstance()?.resume();
  }
}
