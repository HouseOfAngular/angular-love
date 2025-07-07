import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { RoadmapBottomSheetNotifierService } from '../../services/roadmap-bottomsheet-notifier.service';
import { RoadmapStandardNode } from '../../types/roadmap-node';
import { RoadmapNodeLabelComponent } from '../roadmap-node-label/roadmap-node-label.component';

@Component({
  selector: 'al-roadmap-basic-node',
  template: `
    @if (node().label; as label) {
      <al-roadmap-node-label
        class="label absolute z-[20] -translate-y-1/2"
        [class]="labelClass()"
        [label]="label"
      />
    }

    <div
      class="node relative w-fit text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD]"
      [ngClass]="{
        'roadmap-hover-border-gradient hover:cursor-pointer':
          variant() === 'secondary',
      }"
      [attr.node-id]="node().id"
      (pointerup)="_roadmapBottomSheetNotifierService.openBottomSheet(node())"
    >
      <div class="relative z-10 rounded-lg px-6 py-4" [class]="tileClass()">
        {{ node().title }}
      </div>
    </div>
  `,
  styleUrl: 'roadmap-basic-node.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RoadmapNodeLabelComponent, NgClass],
  host: {
    class: 'relative',
  },
  standalone: true,
})
export class RoadmapBasicNodeComponent {
  protected readonly _roadmapBottomSheetNotifierService = inject(
    RoadmapBottomSheetNotifierService,
  );

  readonly node = input.required<RoadmapStandardNode>();
  readonly variant = input.required<'primary' | 'secondary'>();

  protected readonly labelClass = computed(() => {
    const variant = this.variant();
    if (variant === 'primary') {
      return `translate-x-1.5x`;
    } else return 'translate-x-full';
  });

  protected readonly tileClass = computed(() => {
    const variant = this.variant();

    switch (variant) {
      case 'primary':
        return 'm-[4px] bg-[--primary-color] text-[24px]';
      case 'secondary':
        return 'm-[2px] bg-[--secondary-color] text-[20px]';
      default:
        return '';
    }
  });
}
