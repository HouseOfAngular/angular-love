import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RoadmapStandardNode } from '../../types/roadmap-node';

@Component({
  selector: 'al-roadmap-angular-love-node',
  template: `
    <div
      class="roadmap-hover-border-gradient relative w-fit text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD]"
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
})
export class RoadmapAngularLoveNodeComponent {
  readonly node = input.required<RoadmapStandardNode>();
}
