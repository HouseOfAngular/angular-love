import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RoadmapNode } from '../../types/roadmap-node';

@Component({
  selector: 'al-roadmap-primary-node',
  template: `
    <div
      class="roadmap-hover-border-gradient relative w-fit text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD]"
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
})
export class RoadmapPrimaryNodeComponent {
  readonly node = input.required<RoadmapNode>();
}
