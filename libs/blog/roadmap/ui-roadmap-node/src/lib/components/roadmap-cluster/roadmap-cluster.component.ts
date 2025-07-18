import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';

import { RoadmapBottomSheetNotifierService } from '../../services/roadmap-bottomsheet-notifier.service';
import {
  RoadmapClusterNode,
  RoadmapStandardNode,
} from '../../types/roadmap-node';
import { RoadmapBasicNodeComponent } from '../roadmap-basic-node/roadmap-basic-node.component';

@Component({
  selector: 'al-roadmap-cluster',
  imports: [RoadmapBasicNodeComponent],
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
  host: {
    class:
      'block bg-gradient-to-br from-[#100F15] to-[#3B0019] rounded-lg text-center border-2 border-[#FDF5FD]',
  },
  styleUrl: 'roadmap-cluster.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadmapClusterComponent {
  private readonly _difference = 5;
  private readonly _pointerDown = signal<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  // private eventListener = (event: PointerEvent) => {
  //   this.onPointerUp(event);
  //   document.removeEventListener('pointerup', this.eventListener);
  // };
  protected readonly _roadmapBottomSheetNotifierService = inject(
    RoadmapBottomSheetNotifierService,
  );
  readonly cluster = input.required<RoadmapClusterNode>();

  protected onKeyDown(event: KeyboardEvent, node: RoadmapStandardNode): void {
    if (event.code === 'Enter' || event.code === 'Space') {
      this._roadmapBottomSheetNotifierService.openBottomSheet(node);
    }
  }

  protected onPointerDown(event: PointerEvent) {
    this._pointerDown.set({ x: event.clientX, y: event.clientY });
  }

  protected onPointerUp(event: PointerEvent, node: RoadmapStandardNode): void {
    const dx = Math.abs(event.clientX - this._pointerDown().x);
    const dy = Math.abs(event.clientY - this._pointerDown().y);

    if (dx < this._difference && dy < this._difference) {
      this._roadmapBottomSheetNotifierService.openBottomSheet(node);
    }
  }
}
