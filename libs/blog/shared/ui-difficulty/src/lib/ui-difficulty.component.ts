import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

export type UiDifficulty = 'beginner' | 'intermediate' | 'advanced';

@Component({
  selector: 'al-difficulty',
  standalone: true,
  template: `
    <div
      class="text-al-foreground/90 flex items-center overflow-hidden text-sm"
    >
      <!-- Left Block -->
      <div
        class="flex items-center self-stretch rounded-l-md pl-1 text-center align-middle xl:pl-2"
        [ngClass]="{
          'bg-al-background': isColorBackground(),
          'bg-al-border': !isColorBackground(),
        }"
      >
        <span
          *transloco="let t; read: 'difficulty'"
          class="hidden self-center first-letter:uppercase xl:block"
        >
          {{ t(difficulty()) }}
        </span>
      </div>

      <!-- Middle Block -->
      @for (level of [0, 1, 2]; track $index) {
        <div class="relative flex items-center overflow-hidden py-1">
          <!-- Dot Container -->
          <div
            class="mx-0.5 inline-block h-4 w-4 rounded-full bg-transparent lg:mx-1"
            [ngClass]="{
              'shadow-al-full-background': isColorBackground(),
              'shadow-al-full-border': !isColorBackground(),
            }"
          ></div>

          @if (difficultyLevel() >= level) {
            <!-- Dot -->
            <div
              class="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 transform rounded-full"
              [ngClass]="{
                'bg-green-500': difficultyLevel() === 0,
                'bg-yellow-500': difficultyLevel() === 1,
                'bg-red-500': difficultyLevel() === 2,
              }"
            ></div>
          } @else {
            <!-- Empty Dot -->
            <div
              class="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full"
              [ngClass]="{
                'bg-al-background': isColorBackground(),
                'bg-al-border': !isColorBackground(),
              }"
            ></div>
          }
        </div>
      }

      <!-- Right Block -->
      <div
        class="flex items-center self-stretch rounded-r-md pr-1 text-center align-middle"
        [ngClass]="{
          'bg-al-background': isColorBackground(),
          'bg-al-border': !isColorBackground(),
        }"
      ></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TranslocoDirective],
})
export class UiDifficultyComponent {
  readonly difficulty = input.required<UiDifficulty>();
  readonly color = input<'background' | 'border'>('background');

  readonly difficultyLevel = computed(() => {
    const difficulty = this.difficulty();
    return this._order.findIndex((o) => o === difficulty);
  });
  readonly isColorBackground = computed(() => this.color() === 'background');

  private readonly _order = ['beginner', 'intermediate', 'advanced'];
}
