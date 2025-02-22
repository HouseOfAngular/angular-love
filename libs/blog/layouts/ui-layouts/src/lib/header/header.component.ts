import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

import {
  LanguagePickerComponent,
  NavigationComponent,
} from '@angular-love/blog/layouts/ui-navigation';

import {
  HeaderHamburgerComponent,
  HeaderLogoComponent,
  HeaderMobileMenuComponent,
} from './components';

@Component({
  standalone: true,
  selector: 'al-header',
  template: `
    <header class="bg-al-background/95 z-30 h-20 w-full border-b shadow-xl">
      <div
        class="mx-auto flex h-full w-full max-w-screen-xl items-center justify-between px-6 py-4 xl:px-0"
      >
        <al-header-logo />

        <al-navigation class="hidden lg:block" />

        <div class="flex flex-row items-center">
          <al-language-picker
            class="hidden md:block"
            [language]="language()"
            (languageChange)="languageChange.emit($event)"
          />

          <ng-content />

          <al-header-hamburger
            [isOpened]="showNav()"
            (toggleOpen)="toggleNav()"
          />
        </div>
      </div>
    </header>

    <al-header-mobile-menu
      [isOpened]="showNav()"
      [language]="language()"
      (closed)="toggleNav()"
      (languageChange)="languageChange.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavigationComponent,
    HeaderLogoComponent,
    HeaderHamburgerComponent,
    HeaderMobileMenuComponent,
    LanguagePickerComponent,
  ],
})
export class HeaderComponent {
  readonly language = input.required<string>();

  protected languageChange = output<string>();

  protected showNav = signal<boolean>(false);

  protected toggleNav(): void {
    this.showNav.set(!this.showNav());
  }
}
