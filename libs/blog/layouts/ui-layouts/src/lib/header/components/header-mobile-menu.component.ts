import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { NavigationComponent } from '@angular-love/blog/layouts/ui-navigation';

@Component({
  standalone: true,
  selector: 'al-header-mobile-menu',
  template: `
    <div
      class="bg-al-background fixed -top-[100%] left-0 z-40 flex h-full w-full flex-row items-center justify-center transition-transform duration-300 lg:hidden"
      [ngClass]="{ 'translate-y-[100%]': isOpened() }"
      [attr.aria-hidden]="isOpened()"
    >
      <al-navigation (navigated)="closed.emit()" layout="vertical" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavigationComponent, NgClass],
})
export class HeaderMobileMenuComponent {
  readonly isOpened = input.required<boolean>();

  readonly closed = output<void>();
}
