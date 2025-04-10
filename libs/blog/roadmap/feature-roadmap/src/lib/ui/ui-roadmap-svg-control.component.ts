import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, input, output } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { TooltipDirective } from '@angular-love/ui-tooltip';

import { EventType } from '../feature-roadmap.component';

const connectedPosition: ConnectedPosition = {
  originX: 'start',
  originY: 'center',
  overlayX: 'end',
  overlayY: 'center',
};

@Component({
  selector: 'al-ui-roadmap-svg-control',
  imports: [
    FastSvgComponent,
    TooltipDirective,
    TranslocoDirective,
    TranslocoPipe,
  ],
  template: `
    <ng-container *transloco="let t; read: 'svgControl'">
      <button
        alTooltip
        class="hover:text-al-primary"
        [customPosition]="connectedPosition"
        [tooltipText]="event() | transloco"
        (click)="resizeRoadmap.emit(event())"
      >
        <fast-svg [name]="iconName()" [size]="size()" />
      </button>
    </ng-container>
  `,
})
export class UiRoadmapSvgControlComponent {
  readonly iconName = input.required<string>();
  readonly size = input.required<string>();
  readonly event = input.required<EventType>();

  resizeRoadmap = output<EventType>();
  protected readonly connectedPosition = connectedPosition;
}
