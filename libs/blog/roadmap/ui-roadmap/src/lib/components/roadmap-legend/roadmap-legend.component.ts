import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import {
  Label,
  RoadmapNodeLabelComponent,
} from '@angular-love/blog/roadmap/ui-roadmap-node';

interface LegendSymbol {
  symbol: Label;
  description: string;
}

@Component({
  imports: [RoadmapNodeLabelComponent, FastSvgComponent],
  selector: 'al-roadmap-legend',
  template: `
    <ng-container>
      <button
        class="bg-al-roadmap-primary absolute right-0 top-1/2 -translate-y-[12px] translate-x-[18px] rounded-full"
        (click)="toggleLegend()"
      >
        <fast-svg
          [name]="legendOpened() ? 'arrow-left' : 'arrow-right'"
          size="24"
        />
      </button>
      <ul>
        @for (legendSymbol of legendSymbols; track legendSymbol.symbol) {
          <li class="flex items-center gap-1 px-2 py-2">
            <al-roadmap-node-label
              class="max-w-3xs block "
              [label]="legendSymbol.symbol"
            />
            <p>{{ legendSymbol.description }}</p>
          </li>
        }
      </ul>
    </ng-container>
  `,
  host: {
    class:
      'hidden lg:flex h-fit w-fit flex-col items-center gap-8 border border-white rounded-lg bg-gradient-to-br from-[#100f15] to-[#3b0019] transition-left duration-300 ease-in-out ',
    '[class]': 'hostClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadmapLegendComponent {
  private readonly isOpen = signal<boolean>(true);
  protected readonly legendOpened = computed(() => this.isOpen());
  protected readonly hostClass = computed(() => {
    const isOpen = this.isOpen();
    if (isOpen) {
      return 'left-4';
    } else return '-left-[576px]';
  });
  protected readonly legendSymbols: LegendSymbol[] = [
    {
      symbol: 'recommended',
      description: 'It is recommended by the Angular.love team',
    },
    {
      symbol: 'optional',
      description: 'Knowing it is very helpful, but not required',
    },
    {
      symbol: 'comingSoon',
      description:
        'Upcoming features – don’t hesitate to write your own article',
    },
  ];

  toggleLegend() {
    this.isOpen.set(!this.isOpen());
  }
}
