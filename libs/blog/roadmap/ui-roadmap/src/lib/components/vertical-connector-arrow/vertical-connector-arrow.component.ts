import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'al-vertical-connector-arrow',
  template: `
    <div
      aria-hidden="true"
      class="grow border-l-[6px] border-l-(--primary)"
    ></div>
    <div
      aria-hidden="true"
      class="h-0 w-0 border-t-30 border-r-16 border-l-16 border-t-(--primary) border-r-transparent border-l-transparent"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col items-center h-full',
  },
})
export class VerticalConnectorArrowComponent {}
