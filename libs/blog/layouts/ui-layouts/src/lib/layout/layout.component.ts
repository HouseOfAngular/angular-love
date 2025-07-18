import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export interface LayoutConfig {
  roadmap: boolean;
}

@Component({
  selector: 'al-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grid grid-rows-[auto_1fr_auto]',
    '[class]': 'class()',
  },
})
export class LayoutComponent {
  readonly layoutConfig = input<LayoutConfig>();

  protected readonly class = computed(() => {
    const layoutConfig = this.layoutConfig();
    if (layoutConfig?.roadmap) {
      return {
        'flex-1': true,
        'basis-0': true,
        'overflow-hidden': true,
        'min-h-full': true,
      };
    } else
      return {
        'min-h-screen': true,
      };
  });
}
