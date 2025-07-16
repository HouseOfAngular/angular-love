import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { RoadmapBottomSheetNotifierService } from '../../services/roadmap-bottomsheet-notifier.service';
import { RoadmapStandardNode } from '../../types/roadmap-node';
import { RoadmapNodeLabelComponent } from '../roadmap-node-label/roadmap-node-label.component';

@Component({
  selector: 'al-roadmap-basic-node',
  template: `
    @if (node().label; as label) {
      <al-roadmap-node-label
        class="absolute -top-4 right-0 z-[20] translate-x-1/2"
        [label]="label"
        (keydown)="onKeyDown($event)"
        (pointerup)="
          this._roadmapBottomSheetNotifierService.openBottomSheet(this.node())
        "
      />
    }

    <button
      class="node relative w-fit text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD]"
      [attr.node-id]="node().id"
      (keydown)="onKeyDown($event)"
      (pointerdown)="onPointerDown($event)"
      (pointerup)="onPointerUp($event)"
    >
      <div class="relative z-10 rounded-lg px-6 py-4" [class]="tileClass()">
        {{ node().title }}
      </div>
    </button>
  `,
  styleUrl: 'roadmap-basic-node.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RoadmapNodeLabelComponent],
  host: {
    class: 'relative',
  },
})
export class RoadmapBasicNodeComponent {
  private readonly difference = 5;
  private readonly _pointerDown = signal<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  protected readonly _roadmapBottomSheetNotifierService = inject(
    RoadmapBottomSheetNotifierService,
  );

  readonly node = input.required<RoadmapStandardNode>();
  readonly variant = input.required<'primary' | 'secondary' | 'angular-love'>();

  // protected readonly labelClass = computed(() => {
  //   const variant = this.variant();
  //   if (variant === 'primary') {
  //     return `translate-x-1.5x`;
  //   } else return 'translate-x-full';
  // });

  protected readonly tileClass = computed(() => {
    const variant = this.variant();

    switch (variant) {
      case 'primary':
        return 'm-[2px] bg-al-roadmap-primary text-[24px]';
      case 'secondary':
        return 'm-[2px] bg-al-roadmap-secondary text-[20px]';
      case 'angular-love':
        return 'm-[4px] bg-gradient-to-r from-al-roadmap-secondary to-al-roadmap-accent text-[24px]';
      default:
        return '';
    }
  });

  onPointerDown(event: PointerEvent) {
    this._pointerDown.set({ x: event.clientX, y: event.clientY });
  }

  onPointerUp(event: PointerEvent) {
    const dx = Math.abs(event.clientX - this._pointerDown().x);
    const dy = Math.abs(event.clientY - this._pointerDown().y);

    if (dx < this.difference && dy < this.difference) {
      this._roadmapBottomSheetNotifierService.openBottomSheet(this.node());
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Enter' || event.code === 'Space') {
      this._roadmapBottomSheetNotifierService.openBottomSheet(this.node());
    }
  }
}
