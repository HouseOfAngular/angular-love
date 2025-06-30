import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';

import { RoadmapBottomSheetNotifierService } from '@angular-love/roadmap-utils';

import { RoadmapNode } from '../../types/roadmap-node';

@Component({
  selector: 'al-roadmap-primary-node',
  template: `
    <div
      class="roadmap-hover-border-gradient relative w-fit text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD]"
      (pointerup)="
        _roadmapBottomSheetNotifierService.openBottomSheet(node().id)
      "
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
  host: {
    '[attr.node-id]': 'node().id',
  },
})
export class RoadmapPrimaryNodeComponent {
  protected readonly _roadmapBottomSheetNotifierService = inject(
    RoadmapBottomSheetNotifierService,
  );
  readonly node = input.required<RoadmapNode>();
}
