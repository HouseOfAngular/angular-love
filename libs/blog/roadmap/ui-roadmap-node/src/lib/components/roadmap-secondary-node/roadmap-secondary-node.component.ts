import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { RoadmapBottomSheetNotifierService } from '../../services/roadmap-bottomsheet-notifier.service';
import { RoadmapStandardNode } from '../../types/roadmap-node';
import { RoadmapNodeLabelComponent } from '../roadmap-node-label/roadmap-node-label.component';

@Component({
  selector: 'al-roadmap-secondary-node',
  template: `
    @if (node().label; as label) {
      <al-roadmap-node-label
        class="absolute z-[20] -translate-y-1/2 translate-x-full"
        [label]="label"
      />
    }
    <div
      class="roadmap-hover-border-gradient relative w-fit text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD] hover:cursor-pointer"
      (pointerup)="_roadmapBottomSheetNotifierService.openBottomSheet(node())"
      data-click-target
    >
      <div
        class="relative z-10 m-[2px] rounded-lg bg-[--secondary-color] px-6 py-4 text-[20px]"
      >
        {{ node().title }}
      </div>
    </div>
  `,
  styleUrl: 'roadmap-secondary-node.component.scss',
  imports: [RoadmapNodeLabelComponent],

  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative',
    '[attr.node-id]': 'node().id',
  },
})
export class RoadmapSecondaryNodeComponent {
  protected readonly _roadmapBottomSheetNotifierService = inject(
    RoadmapBottomSheetNotifierService,
  );

  readonly node = input.required<RoadmapStandardNode>();
}
