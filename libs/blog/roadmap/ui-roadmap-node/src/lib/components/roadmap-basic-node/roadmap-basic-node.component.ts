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
        class="label absolute -top-4 right-0 z-[20] translate-x-1/2"
        [label]="label"
        (keydown)="onKeyDown($event)"
        (pointerup)="
          this._roadmapBottomSheetNotifierService.openBottomSheet(this.node())
        "
      />
    }

    <button
      class="node relative w-full text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD]"
      [attr.node-id]="node().id"
      (focus)="_roadmapBottomSheetNotifierService.focusNode(node())"
      (keydown)="onKeyDown($event)"
      (pointerdown)="onPointerDown($event)"
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
  readonly node = input.required<RoadmapStandardNode>();
  readonly variant = input.required<'primary' | 'secondary' | 'angular-love'>();

  private readonly _difference = 15;
  private readonly _pointerDown = signal<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  protected readonly _roadmapBottomSheetNotifierService = inject(
    RoadmapBottomSheetNotifierService,
  );
  private eventListener = (event: PointerEvent) => {
    this.onPointerUp(event);
    document.removeEventListener('pointerup', this.eventListener);
  };

  protected readonly tileClass = computed(() => {
    switch (this.variant()) {
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

  protected onPointerDown(event: PointerEvent) {
    this._pointerDown.set({ x: event.clientX, y: event.clientY });
    document.addEventListener('pointerup', this.eventListener);
  }

  protected onPointerUp(event: PointerEvent) {
    const dx = Math.abs(event.clientX - this._pointerDown().x);
    const dy = Math.abs(event.clientY - this._pointerDown().y);

    if (dx < this._difference && dy < this._difference) {
      this._roadmapBottomSheetNotifierService.openBottomSheet(this.node());
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Enter' || event.code === 'Space') {
      this._roadmapBottomSheetNotifierService.openBottomSheet(this.node());
    }
  }
}
