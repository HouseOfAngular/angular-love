import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  signal,
} from '@angular/core';

export interface NodeConnectionPoint {
  offsetX: number;
}

@Directive({
  selector: '[alNodeConnectionPoint]',
})
export class NodeConnectionPointDirective {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(
    ElementRef<HTMLElement>,
  );

  readonly nodeConnectionPoint = signal<NodeConnectionPoint | undefined>(
    undefined,
  );

  constructor() {
    afterNextRender(() => {
      const elementOffsetLeft = this._elementRef.nativeElement.offsetLeft;
      const elementOffsetWidth = this._elementRef.nativeElement.offsetWidth;
      const roadmapCenterPoint =
        (this._elementRef.nativeElement.offsetParent?.clientWidth || 0) / 2;

      // Offset is calculated relative to the center of the roadmap
      const offsetX =
        elementOffsetLeft + elementOffsetWidth / 2 - roadmapCenterPoint;
      this.nodeConnectionPoint.set({ offsetX: Math.abs(offsetX) });
    });
  }
}
