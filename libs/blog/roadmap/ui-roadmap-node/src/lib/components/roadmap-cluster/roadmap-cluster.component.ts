import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';

import { RoadmapBottomSheetNotifierService } from '../../services/roadmap-bottomsheet-notifier.service';
import {
  RoadmapClusterNode,
  RoadmapStandardNode,
} from '../../types/roadmap-node';

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
        <button
          class="roadmap-hover-border-gradient relative w-full text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD] hover:cursor-pointer"
          [attr.node-id]="clusterNode.id"
          (keydown)="onKeyDown($event, clusterNode)"
          (pointerup)="
            _roadmapBottomSheetNotifierService.openBottomSheet(clusterNode)
          "
        >
          <div
            class="bg-al-roadmap-secondary relative z-10 m-[1px]  rounded-lg px-6 py-4"
          >
            <div class="text-[20px]">{{ clusterNode.title }}</div>
          </div>
        </button>
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
  protected readonly _roadmapBottomSheetNotifierService = inject(
    RoadmapBottomSheetNotifierService,
  );
  readonly cluster = input.required<RoadmapClusterNode>();

  onKeyDown(event: KeyboardEvent, node: RoadmapStandardNode): void {
    if (event.code === 'Enter' || event.code === 'Space') {
      this._roadmapBottomSheetNotifierService.openBottomSheet(node);
    }
  }
}
