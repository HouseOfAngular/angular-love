import { Component, input, output } from '@angular/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { EventType } from '../feature-roadmap.component';

@Component({
  selector: 'al-ui-roadmap-svg-control',
  imports: [FastSvgComponent],
  template: `
    <button
      class="hover:text-al-primary"
      (click)="resizeRoadmap.emit(this.event())"
    >
      <fast-svg [name]="this.iconName()" [size]="this.size()" />
    </button>
  `,
})
export class UiRoadmapSvgControlComponent {
  readonly iconName = input.required<string>();
  readonly size = input.required<string>();
  readonly event = input.required<EventType>();

  resizeRoadmap = output<EventType>();
}
