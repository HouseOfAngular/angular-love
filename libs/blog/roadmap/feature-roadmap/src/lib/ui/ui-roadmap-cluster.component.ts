import { Component, input } from '@angular/core';

import { RoadmapCluster } from '../feature-roadmap.component';

@Component({
  selector: 'al-ui-roadmap-cluster',
  template: `
    <div
      class="relative z-10 m-[-2px] rounded-lg border-2 border-[#FDF5FD] bg-[--secondary-color] px-6 py-4"
    >
      <div class="text-[20px]">{{ cluster().title }}</div>
    </div>
    <div class="m-[2px] flex flex-col gap-[10px] p-3">
      @for (clusterNode of cluster().clusteredNodes; track clusterNode.id) {
        <div
          class="roadmap-hover-border-gradient relative w-full text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD]"
        >
          <div
            class="relative z-10 m-[1px] rounded-lg  bg-[--secondary-color] px-6 py-4"
          >
            <div class="text-[20px]">{{ clusterNode.title }}</div>
          </div>
        </div>
      }
    </div>
  `,
  host: {
    class:
      'block bg-gradient-to-br from-[#100F15] to-[#3B0019] rounded-lg text-center border-2 border-[#FDF5FD]',
    style:
      '--primary-color: #B3004A; --secondary-color: #66002B; --gradient-color: #481CAB; --on-hover-border-1: #923CFF; --on-hover-border-2: #FF006A',
  },
  styleUrls: ['./roadmap-hover-border-gradient.scss'],
})
export class UiRoadmapClusterComponent {
  readonly cluster = input.required<RoadmapCluster>();
}
