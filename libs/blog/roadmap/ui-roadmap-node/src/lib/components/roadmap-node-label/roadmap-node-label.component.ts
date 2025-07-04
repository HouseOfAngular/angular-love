import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { Label } from '../../types/roadmap-node';

@Component({
  selector: 'al-roadmap-node-label',
  template: `
    <div
      class="cursor-pointer rounded-lg px-2 py-1 text-center text-white"
      [class]="backgroundColorClass()"
    >
      {{ label() }}
    </div>
  `,
  styleUrl: 'roadmap-node-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadmapNodeLabelComponent {
  readonly label = input.required<Label>();

  protected readonly backgroundColorClass = computed(() => {
    const label = this.label();
    switch (label) {
      case 'optional':
        return 'bg-[--optional]';
      case 'comingSoon':
        return 'bg-[--comingSoon]';
      case 'recommended':
        return 'bg-gradient-to-r from-[--secondary-color] to-[--gradient-color]';
      default:
        return '';
    }
  });
}
