import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'al-ui-tooltip',
  template: `
    <div
      class="box-border max-w-52 rounded-sm bg-[#2e2f3a] p-[0.3rem] text-sm text-white"
      [ngClass]="{ 'mt-2': 'bottom' }"
    >
      {{ tooltipText() }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class UiTooltipComponent {
  tooltipText = signal<string | undefined>('');
}
