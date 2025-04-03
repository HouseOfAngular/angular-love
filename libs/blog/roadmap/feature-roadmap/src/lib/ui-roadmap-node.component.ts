import { Component, input } from '@angular/core';

import { RoadmapNode } from './feature-roadmap.component';
import { UiRoadmapClusterComponent } from './ui-roadmap-cluster.component';

@Component({
  selector: 'al-ui-roadmap-node',
  template: `
    <div
      class="node-container relative w-fit text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD]"
      style="
      --primary-color: #B3004A; --secondary-color: #66002B; --gradient-color: #481CAB; --on-hover-border-1: #923CFF; --on-hover-border-2: #FF006A"
    >
      @if (node().nodeType === 'primary') {
        <div
          class="relative z-10 m-[4px] rounded-lg bg-[--primary-color] px-6 py-4"
        >
          <div class="text-[24px]">{{ node().title }}</div>
        </div>
      } @else if (node().nodeType === 'secondary') {
        <div
          class="relative z-10 m-[2px] rounded-lg  bg-[--secondary-color] px-6 py-4"
        >
          <div class="text-[20px]">{{ node().title }}</div>
        </div>
      } @else if (node().nodeType === 'cluster') {
        <al-ui-roadmap-cluster [cluster]="$any(node())"></al-ui-roadmap-cluster>
      } @else if (node().nodeType === 'angular-love') {
        <div
          class="relative z-10 m-[4px] rounded-lg  bg-gradient-to-r from-[--secondary-color] to-[--gradient-color] px-6 py-4"
        >
          <div class="text-[24px]">{{ node().title }}</div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./ui-roadmap-node.component.scss'],
  imports: [UiRoadmapClusterComponent],
})
export class UiRoadmapNodeComponent {
  readonly node = input.required<RoadmapNode>();
}
