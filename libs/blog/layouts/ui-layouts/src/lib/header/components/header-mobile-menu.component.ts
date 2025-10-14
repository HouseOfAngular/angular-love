import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  LanguagePickerComponent,
  NavigationComponent,
} from '@angular-love/blog/layouts/ui-navigation';

import { headerNavItems } from '../header-nav-items';

@Component({
  selector: 'al-header-mobile-menu',
  template: `
    <div
      class="bg-al-background fixed -top-[100%] left-0 z-40 flex h-full w-full flex-row items-center justify-center transition-transform duration-300 lg:hidden"
      [ngClass]="{ 'translate-y-[100%]': isOpened() }"
      [attr.aria-hidden]="isOpened()"
    >
      <al-navigation
        class="mobile-menu__navigation"
        [navItems]="navItems"
        (navigated)="closed.emit()"
        layout="vertical"
      >
        <li class="flex justify-center">
          <al-language-picker
            [language]="language()"
            (languageChange)="languageChange.emit($event)"
          />
        </li>
      </al-navigation>
    </div>
  `,
  styleUrl: './header-mobile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavigationComponent, NgClass, LanguagePickerComponent],
})
export class HeaderMobileMenuComponent {
  readonly navItems = headerNavItems;

  readonly isOpened = input.required<boolean>();
  readonly language = input.required<string>();

  protected languageChange = output<string>();
  readonly closed = output<void>();
}
