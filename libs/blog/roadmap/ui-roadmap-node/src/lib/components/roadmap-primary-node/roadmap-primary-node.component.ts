import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';

import { RoadmapBottomSheetNotifierService } from '../../services/roadmap-bottomsheet-notifier.service';
import { RoadmapStandardNode } from '../../types/roadmap-node';
import { RoadmapNodeLabelComponent } from '../roadmap-node-label/roadmap-node-label.component';

@Component({
  selector: 'al-roadmap-primary-node',
  template: `
    @if (node().label; as label) {
      <al-roadmap-node-label
        class="translate-x-1.5x absolute z-[20] -translate-y-1/2"
        [label]="label"
      />
    }
    <div
      class="roadmap-hover-border-gradient relative w-fit text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD] hover:cursor-pointer "
      (pointerup)="_roadmapBottomSheetNotifierService.openBottomSheet(node())"
    >
      <div
        class="relative z-10 m-[4px] rounded-lg bg-[--primary-color] px-6 py-4 text-[24px]"
      >
        {{ node().title }}
      </div>
    </div>
  `,
  styleUrl: 'roadmap-primary-node.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RoadmapNodeLabelComponent],
  host: {
    class: 'relative',
    '(pointerup)': '_roadmapBottomSheetNotifierService.openBottomSheet(node())',
    '[attr.node-id]': 'node().id',
  },
})
export class RoadmapPrimaryNodeComponent {
  protected readonly _roadmapBottomSheetNotifierService = inject(
    RoadmapBottomSheetNotifierService,
  );
  readonly node = input.required<RoadmapStandardNode>();
}
