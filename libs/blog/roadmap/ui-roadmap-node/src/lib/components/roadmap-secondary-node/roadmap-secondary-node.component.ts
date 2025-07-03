import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';

import { RoadmapBottomSheetNotifierService } from '../../services/roadmap-bottomsheet-notifier.service';
import { RoadmapNode, RoadmapStandardNode } from '../../types/roadmap-node';

@Component({
  selector: 'al-roadmap-secondary-node',
  template: `
    <div
      class="roadmap-hover-border-gradient relative w-fit text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD] hover:cursor-pointer"
    >
      <div
        class="relative z-10 m-[2px] rounded-lg bg-[--secondary-color] px-6 py-4 text-[20px]"
      >
        {{ node().title }}
      </div>
    </div>
  `,
  styleUrl: 'roadmap-secondary-node.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.node-id]': 'node().id',
    '(pointerup)': '_roadmapBottomSheetNotifierService.openBottomSheet(node())',
  },
})
export class RoadmapSecondaryNodeComponent {
  protected readonly _roadmapBottomSheetNotifierService = inject(
    RoadmapBottomSheetNotifierService,
  );

  readonly node = input.required<RoadmapStandardNode>();
}
