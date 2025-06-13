import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';

import { RoadmapBottomsheetManagerService } from '@angular-love/roadmap-utils';

import { RoadmapNode } from '../../types/roadmap-node';

@Component({
  selector: 'al-roadmap-secondary-node',
  template: `
    <div
      class="roadmap-hover-border-gradient relative w-fit text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD]"
      (pointerup)="_roadmapBottomsheetManagerService.openBottomSheet(node().id)"
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
  },
})
export class RoadmapSecondaryNodeComponent {
  protected readonly _roadmapBottomsheetManagerService = inject(
    RoadmapBottomsheetManagerService,
  );

  readonly node = input.required<RoadmapNode>();
}
