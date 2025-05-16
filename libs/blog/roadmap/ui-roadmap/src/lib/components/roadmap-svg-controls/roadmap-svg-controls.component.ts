import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

export type EventType = 'increment' | 'decrement' | 'reset' | 'zoom-reset';

interface Control {
  size: string;
  name: string;
  event: EventType;
}

@Component({
  selector: 'al-roadmap-svg-controls',
  imports: [FastSvgComponent],
  template: `
    @for (control of controls; track $index) {
      <button
        class="hover:text-al-primary"
        (click)="resizeRoadmap.emit(control.event)"
      >
        <fast-svg [name]="control.name" [size]="control.size" />
      </button>
    }
  `,
  host: {
    class: 'flex h-fit w-fit flex-col items-center gap-8',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadmapSvgControlsComponent {
  readonly resizeRoadmap = output<EventType>();

  protected readonly controls: Control[] = [
    {
      event: 'increment',
      size: '24',
      name: 'zoom-in',
    },
    {
      event: 'reset',
      size: '24',
      name: 'circle-center',
    },
    {
      event: 'zoom-reset',
      size: '24',
      name: 'zoom-reset',
    },
    {
      event: 'decrement',
      size: '24',
      name: 'zoom-out',
    },
  ];
}
