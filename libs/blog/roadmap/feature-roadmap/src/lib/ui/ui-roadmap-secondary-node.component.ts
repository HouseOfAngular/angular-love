import { Component, input } from '@angular/core';

import { RoadmapNode } from '../feature-roadmap.component';

@Component({
  selector: 'al-ui-roadmap-secondary-node',
  template: `
    <div
      class="roadmap-hover-border-gradient relative w-fit text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD]"
      style="
      --primary-color: #B3004A; --secondary-color: #66002B; --gradient-color: #481CAB; --on-hover-border-1: #923CFF; --on-hover-border-2: #FF006A"
    >
      <div
        class="relative z-10 m-[2px] rounded-lg  bg-[--secondary-color] px-6 py-4"
      >
        <div class="text-[20px]">{{ node().title }}</div>
      </div>
    </div>
  `,
  styleUrls: ['./roadmap-hover-border-gradient.scss'],
})
export class UiRoadmapSecondaryNodeComponent {
  readonly node = input.required<RoadmapNode>();
}
