import { ElementRef, Injectable } from '@angular/core';
import { PanZoom } from 'panzoom';

@Injectable({
  providedIn: 'root',
})
export class PanZoomService {
  private readonly _transformMargin = 100;

  focusSelectedNode(
    nodeId: string,
    panZoomInstance: PanZoom,
    elementRef: ElementRef<HTMLElement>,
  ) {
    const selectedNode = elementRef.nativeElement.querySelector(
      `[node-id="${nodeId}"]`,
    ) as HTMLElement | null;

    if (!selectedNode) return;

    const nodeRect = selectedNode.getBoundingClientRect();
    const containerRect = elementRef.nativeElement.getBoundingClientRect();

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

  handleRoadmapScrollBounds(
    e: WheelEvent,
    panZoom: PanZoom,
    bottommostNode: HTMLElement,
    topmostNode: HTMLElement,
  ) {
    const transforms = panZoom.getTransform();
    const lowerNodeRect = bottommostNode.getBoundingClientRect();
    const topNodeRect = topmostNode.getBoundingClientRect();
    const viewportCenterY = window.innerHeight / 2;

    if (!transforms) return;

    if (lowerNodeRect && lowerNodeRect.top < this._transformMargin) {
      const nodeCenterY = lowerNodeRect.top + lowerNodeRect.height / 2;
      const deltaY = viewportCenterY - nodeCenterY;
      this.correctPanBy(panZoom, 0, deltaY);
    }

    if (
      topNodeRect &&
      topNodeRect.bottom > window.innerHeight - this._transformMargin
    ) {
      const nodeCenterY = topNodeRect.bottom + topNodeRect.height / 2;
      const deltaY = viewportCenterY - nodeCenterY;
      this.correctPanBy(panZoom, 0, deltaY);
    }

    panZoom.moveTo(transforms.x - e.deltaX, transforms.y - e.deltaY);
  }

  correctPanBy(panZoomInstance: PanZoom, deltaX: number, deltaY: number) {
    panZoomInstance.pause();
    panZoomInstance.moveBy(deltaX, deltaY, true);
    panZoomInstance.resume();
  }

  clickOnNode(selectedNodeId: string, elementRef: ElementRef<HTMLElement>) {
    const selectedNode = this._findNode(selectedNodeId, elementRef);

    selectedNode?.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'Enter' }),
    );
  }

  private _findNode(
    selectedNodeId: string,
    elementRef: ElementRef<HTMLElement>,
  ) {
    return elementRef.nativeElement.querySelector(
      `[node-id="${selectedNodeId}"]`,
    ) as HTMLElement | null;
  }

  getRoadmapBounds(elementRef: ElementRef<HTMLElement>): {
    bottommostNode: HTMLElement | null;
    topmostNode: HTMLElement | null;
    leftmostNode: HTMLElement | null;
    rightmostNode: HTMLElement | null;
  } {
    const nodes = elementRef.nativeElement.querySelectorAll(
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
      const parentRect = elementRef.nativeElement.getBoundingClientRect();
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

  disableButtonsEventPropagation(panZoomInstance: PanZoom) {
    const legendButton = document.querySelector('al-roadmap-legend button');
    const controlButtons = document.querySelectorAll(
      'al-roadmap-pan-controls button',
    );

    controlButtons.forEach((btn) => {
      btn.addEventListener('pointerdown', () => {
        panZoomInstance.pause();
      });

      btn.addEventListener('click', () => {
        setTimeout(() => panZoomInstance.resume(), 0);
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

    if (!legendButton) return;
    legendButton.addEventListener('pointerdown', () => {
      panZoomInstance.pause();
    });

    legendButton.addEventListener('click', () => {
      setTimeout(() => panZoomInstance.resume(), 0);
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
