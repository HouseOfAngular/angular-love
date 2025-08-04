import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

export type EventType = 'increment' | 'decrement' | 'reset' | 'zoom-reset';

interface Control {
  name: string;
  ariaLabelKey: string;
  event: EventType;
}

@Component({
  selector: 'al-roadmap-pan-controls',
  template: `
    <ng-container *transloco="let t; read: 'roadmapPage.controls'">
      @for (control of controls; track $index) {
        <button
          class="hover:text-al-primary"
          [attr.aria-label]="t(control.ariaLabelKey)"
          (click)="resizeRoadmap.emit(control.event); $event.stopPropagation()"
        >
          <fast-svg [name]="control.name" size="24" />
        </button>
      }
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FastSvgComponent, TranslocoDirective],
  host: {
    class: 'hidden lg:flex h-fit w-fit flex-col items-center gap-8',
  },
})
export class RoadmapPanControlsComponent {
  readonly resizeRoadmap = output<EventType>();

  protected readonly controls: Control[] = [
    {
      name: 'zoom-in',
      ariaLabelKey: 'zoomInRoadmapButton',
      event: 'increment',
    },
    {
      name: 'circle-center',
      ariaLabelKey: 'restoreRoadmapViewButton',
      event: 'reset',
    },
    {
      name: 'zoom-reset',
      ariaLabelKey: 'restoreRoadmapZoomButton',
      event: 'zoom-reset',
    },
    {
      name: 'zoom-out',
      ariaLabelKey: 'zoomOutRoadmapButton',
      event: 'decrement',
    },
  ];
}
