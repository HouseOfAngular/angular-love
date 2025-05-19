import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';

import { NodeConnectionsGroupDirective } from './node-connections-group.directive';

export interface NodeConnectionPoint {
  offsetX: number;
}

@Directive({
  selector: '[alNodeConnectionPoint]',
})
export class NodeConnectionPointDirective implements OnDestroy {
  private readonly _nodesConnectionsGroupDirective = inject(
    NodeConnectionsGroupDirective,
  );
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(
    ElementRef<HTMLElement>,
  );

  readonly nodeConnectionPoint = signal<NodeConnectionPoint | undefined>(
    undefined,
  );

  constructor() {
    this._nodesConnectionsGroupDirective.registerConnectionPointDirective(this);

    afterNextRender(() => {
      const elementOffsetLeft = this._elementRef.nativeElement.offsetLeft;
      const elementOffsetWidth = this._elementRef.nativeElement.offsetWidth;
      const roadmapCenterPoint =
        (this._elementRef.nativeElement.offsetParent?.clientWidth || 0) / 2;

      // Offset is calculated relative to the center of the roadmap
      const offsetX =
        elementOffsetLeft + elementOffsetWidth / 2 - roadmapCenterPoint;
      this.nodeConnectionPoint.set({ offsetX });
    });
  }

  ngOnDestroy(): void {
    this._nodesConnectionsGroupDirective.unregisterConnectionPointDirective(
      this,
    );
  }
}
