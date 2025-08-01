import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'al-vertical-connector-arrow',
  template: `
    <div class="line flex-grow"></div>
    <div class="arrow-down"></div>
  `,
  styleUrl: 'vertical-connector-arrow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col items-center h-full',
  },
})
export class VerticalConnectorArrowComponent {}
