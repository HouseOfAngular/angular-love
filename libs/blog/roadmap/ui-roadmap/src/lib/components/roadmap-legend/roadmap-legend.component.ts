import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  Label,
  RoadmapNodeLabelComponent,
} from '@angular-love/blog/roadmap/ui-roadmap-node';

interface LegendSymbol {
  symbol: Label;
  description: string;
}

@Component({
  imports: [RoadmapNodeLabelComponent],
  selector: 'al-roadmap-legend',
  template: `
    <ng-container>
      <ul class="">
        @for (legendSymbol of legendSymbols; track legendSymbol.symbol) {
          <li class="flex items-center gap-1 py-2">
            <al-roadmap-node-label
              class="max-w-3xs block"
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
      'hidden lg:flex h-fit w-fit flex-col items-center gap-8 border border-white rounded-lg',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadmapLegendComponent {
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
}
