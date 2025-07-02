import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';

import { RoadmapBottomSheetNotifierService } from '../../services/roadmap-bottomsheet-notifier.service';
import { RoadmapStandardNode } from '../../types/roadmap-node';

@Component({
  selector: 'al-roadmap-angular-love-node',
  template: `
    <div
      class="roadmap-hover-border-gradient relative w-fit text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD] hover:cursor-pointer"
    >
      <div
        class="relative z-10 m-[4px] rounded-lg  bg-gradient-to-r from-[--secondary-color] to-[--gradient-color] px-6 py-4 text-[24px]"
      >
        {{ node().title }}
      </div>
    </div>
  `,
  styleUrl: 'roadmap-angular-love-node.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(pointerup)': '_roadmapBottomSheetNotifierService.openBottomSheet(node())',
    '[attr.node-id]': 'node().id',
  },
})
export class RoadmapAngularLoveNodeComponent {
  protected readonly _roadmapBottomSheetNotifierService = inject(
    RoadmapBottomSheetNotifierService,
  );
  readonly node = input.required<RoadmapStandardNode>();
}
