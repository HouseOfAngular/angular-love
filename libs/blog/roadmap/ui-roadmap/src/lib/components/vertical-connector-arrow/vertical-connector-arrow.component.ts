import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'al-vertical-connector-arrow',
  template: `
    <div class="flex-grow border-l-[6px] border-l-[var(--primary)]"></div>
    <div
      class="h-0 w-0 border-l-[16px] border-r-[16px] border-t-[30px] border-l-transparent border-r-transparent border-t-[var(--primary)]"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col items-center h-full',
  },
})
export class VerticalConnectorArrowComponent {}
