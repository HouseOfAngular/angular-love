import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { Label } from '../../types/roadmap-node';

@Component({
  selector: 'al-roadmap-node-label',
  template: `
    <div
      *transloco="let t; read: 'roadmapPage.label'"
      class="cursor-pointer rounded-lg px-2 py-1 text-center text-white"
      [class]="class()"
    >
      {{ t(label()) }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
})
export class RoadmapNodeLabelComponent {
  readonly label = input.required<Label>();

  protected readonly class = computed(() => {
    switch (this.label()) {
      case 'optional':
        return 'bg-al-roadmap-label-optional';
      case 'comingSoon':
        return 'bg-al-roadmap-label-coming-soon';
      case 'recommended':
        return 'bg-linear-to-r from-al-roadmap-secondary to-al-roadmap-accent';
      default:
        return '';
    }
  });
}
