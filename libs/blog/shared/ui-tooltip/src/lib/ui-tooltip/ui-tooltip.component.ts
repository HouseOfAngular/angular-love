import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'al-ui-tooltip',
  standalone: true,
  template: `
    <div
      class="box-border max-w-[13rem] rounded-[0.25rem] bg-[#2e2f3a] p-[0.3rem] text-sm text-white"
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
