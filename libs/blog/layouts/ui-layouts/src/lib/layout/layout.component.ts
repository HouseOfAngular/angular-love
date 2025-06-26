import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export interface LayoutConfig {
  fullLayout: boolean;
}

@Component({
  selector: 'al-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'min-h-screen grid grid-rows-[auto_1fr_auto]',
    '[class]': 'class()',
  },
})
export class LayoutComponent {
  readonly layoutConfig = input<LayoutConfig>();

  protected readonly class = computed(() => {
    const layoutConfig = this.layoutConfig();
    console.log('---layoutConfig-----', layoutConfig);
    if (layoutConfig?.fullLayout) {
      return {
        'flex-1': true,
        'basis-0': true,
        'overflow-hidden': true,
        'min-h-full': true,
      };
    } else return {};
  });
}
