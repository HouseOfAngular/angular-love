import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RoadmapClusterNode } from '../../types/roadmap-node';
import { RoadmapBasicNodeComponent } from '../roadmap-basic-node/roadmap-basic-node.component';

@Component({
  selector: 'al-roadmap-cluster',
  template: `
    <div
      class="bg-al-roadmap-secondary relative z-10 m-[-2px] rounded-lg border-2 border-[#FDF5FD] px-6 py-4"
      [attr.node-id]="cluster().id"
    >
      <div class="text-[20px]">{{ cluster().title }}</div>
    </div>

    <div class="m-[2px] flex flex-col gap-[10px] p-3">
      @for (clusterNode of cluster().clusteredNodes; track clusterNode.id) {
        <al-roadmap-basic-node [node]="clusterNode" variant="secondary" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RoadmapBasicNodeComponent],
  host: {
    class:
      'block bg-gradient-to-br from-[#100F15] to-[#3B0019] rounded-lg text-center border-2 border-[#FDF5FD]',
  },
})
export class RoadmapClusterComponent {
  readonly cluster = input.required<RoadmapClusterNode>();
}
