import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RoadmapClusterNode } from '../../types/roadmap-node';

@Component({
  selector: 'al-roadmap-cluster',
  template: `
    <div
      class="relative z-10 m-[-2px] rounded-lg border-2 border-[#FDF5FD] bg-[--secondary-color] px-6 py-4"
      [attr.node-id]="cluster().id"
    >
      <div class="text-[20px]">{{ cluster().title }}</div>
    </div>

    <div class="m-[2px] flex flex-col gap-[10px] p-3">
      @for (clusterNode of cluster().clusteredNodes; track clusterNode.id) {
        <div
          class="roadmap-hover-border-gradient relative w-full text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD]"
          [attr.node-id]="clusterNode.id"
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
  },
  styleUrl: 'roadmap-cluster.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadmapClusterComponent {
  readonly cluster = input.required<RoadmapClusterNode>();
}
