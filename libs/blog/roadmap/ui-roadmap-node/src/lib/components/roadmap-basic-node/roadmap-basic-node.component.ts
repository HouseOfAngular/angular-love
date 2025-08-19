import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { RoadmapDialogNotifierService } from '../../services/roadmap-dialog-notifier.service';
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
        (pointerdown)="onPointerDown($event)"
      />
    }

    <button
      class="node light:bg-al-primary-foreground text-al-primary-foreground relative w-full text-nowrap rounded-lg bg-[#fff]"
      [attr.node-id]="node().id"
      (focus)="_roadmapDialogNotifierService.notifyNodeFocused(node())"
      (keydown)="onKeyDown($event)"
      (pointerdown)="onPointerDown($event)"
    >
      <div class="relative z-10 rounded-lg px-6 py-4" [class]="class()">
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

  private readonly _clickMaxPositionDifference = 15;
  private readonly _pointerDownLastPosition = signal<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  protected readonly _roadmapDialogNotifierService = inject(
    RoadmapDialogNotifierService,
  );
  private pointerUpEventListener = (event: PointerEvent) => {
    this.onPointerUp(event);
    document.removeEventListener('pointerup', this.pointerUpEventListener);
  };

  protected readonly class = computed(() => {
    switch (this.variant()) {
      case 'primary':
        return 'm-[2px] bg-al-roadmap-primary light:bg-al-card light:bg-al-radial-gradient-strong text-[24px]';
      case 'secondary':
        return 'm-[2px] bg-al-roadmap-secondary light:bg-al-card light:bg-al-radial-gradient text-[20px]';
      case 'angular-love':
        return 'm-[4px] bg-gradient-to-r from-al-roadmap-secondary to-al-roadmap-accent text-[#fff] text-[24px]';
      default:
        return '';
    }
  });

  protected onPointerDown(event: PointerEvent) {
    this._pointerDownLastPosition.set({ x: event.clientX, y: event.clientY });
    document.addEventListener('pointerup', this.pointerUpEventListener);
  }

  protected onPointerUp(event: PointerEvent) {
    const dx = Math.abs(event.clientX - this._pointerDownLastPosition().x);
    const dy = Math.abs(event.clientY - this._pointerDownLastPosition().y);

    if (
      dx < this._clickMaxPositionDifference &&
      dy < this._clickMaxPositionDifference
    ) {
      this._roadmapDialogNotifierService.notifyNodeClicked(this.node());
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Enter' || event.code === 'Space') {
      this._roadmapDialogNotifierService.notifyNodeClicked(this.node());
    }
  }
}
