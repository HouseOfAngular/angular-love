import { Component, input } from '@angular/core';

import { RoadmapCluster } from './feature-roadmap.component';

@Component({
  selector: 'al-ui-roadmap-cluster',
  template: `
    <div
      class="relative z-10 m-[2px] rounded-lg  bg-[--secondary-color] px-6 py-4"
    >
      <div class="text-[20px]">{{ cluster().title }}</div>
      <div>
        @for (clusterNode of cluster().clusteredNodes; track clusterNode.id) {
          <div
            class="relative z-10 m-[1px] rounded-lg  bg-[--secondary-color] px-6 py-4"
          >
            <div class="text-[20px]">{{ clusterNode.title }}</div>
          </div>
        }
      </div>
    </div>
  `,
})
export class UiRoadmapClusterComponent {
  readonly cluster = input.required<RoadmapCluster>();
}
