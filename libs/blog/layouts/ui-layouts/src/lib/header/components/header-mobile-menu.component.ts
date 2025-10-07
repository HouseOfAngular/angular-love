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
  NavItem,
} from '@angular-love/blog/layouts/ui-navigation';

@Component({
  standalone: true,
  selector: 'al-header-mobile-menu',
  template: `
    <div
      class="bg-al-background fixed -top-[100%] left-0 z-40 flex h-full w-full flex-row items-center justify-center transition-transform duration-300 lg:hidden"
      [ngClass]="{ 'translate-y-[100%]': isOpened() }"
      [attr.aria-hidden]="isOpened()"
    >
      <al-navigation [navItems]="navItems" (navigated)="closed.emit()">
        <li class="flex justify-center">
          <al-language-picker
            [language]="language()"
            (languageChange)="languageChange.emit($event)"
          />
        </li>
      </al-navigation>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavigationComponent, NgClass, LanguagePickerComponent],
})
export class HeaderMobileMenuComponent {
  readonly navItems: NavItem[] = [
    {
      translationPath: 'nav.guides',
      link: ['guides'],
      dataTestId: 'navigation-guides',
    },
    {
      translationPath: 'nav.news',
      link: ['news'],
      dataTestId: 'navigation-news',
    },
    {
      translationPath: 'nav.meetups',
      link: ['https://meetup.angular.love/'],
      externalLink: true,
      dataTestId: 'navigation-meetups',
    },
  ];

  readonly isOpened = input.required<boolean>();
  readonly language = input.required<string>();

  protected languageChange = output<string>();
  readonly closed = output<void>();
}
