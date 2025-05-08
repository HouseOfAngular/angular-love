import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

@Component({
  standalone: true,
  selector: 'al-header-hamburger',
  template: `
    <button
      type="button"
      class="ml-3 flex h-6 w-6 flex-col justify-evenly lg:hidden"
      [attr.aria-label]="isOpened() ? 'Close menu' : 'Open Menu'"
      (click)="toggleOpen.emit()"
    >
      @if (isOpened()) {
        <fast-svg name="cross" />
      } @else {
        <div class="h-1 w-full rounded bg-white"></div>
        <div class="h-1 w-full rounded bg-white"></div>
        <div class="h-1 w-full rounded bg-white"></div>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FastSvgComponent],
  host: {
    class: 'z-50',
  },
})
export class HeaderHamburgerComponent {
  readonly isOpened = input.required<boolean>();

  readonly toggleOpen = output<void>();
}
