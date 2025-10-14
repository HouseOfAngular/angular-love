import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import {
  LanguagePickerComponent,
  NavigationComponent,
} from '@angular-love/blog/layouts/ui-navigation';

import {
  HeaderHamburgerComponent,
  HeaderLogoComponent,
  HeaderMobileMenuComponent,
} from './components';
import { headerNavItems } from './header-nav-items';

@Component({
  standalone: true,
  selector: 'al-header',
  template: `
    <header
      *transloco="let t; read: 'nav'"
      class="bg-al-background/95 z-30 h-20 w-full border-b shadow-xl"
    >
      <div
        class="mx-auto flex h-full w-full max-w-screen-xl items-center justify-between px-6 py-4 xl:px-0"
      >
        <al-header-logo />

        <al-navigation class="hidden lg:block" [navItems]="navItems" />

        <div class="flex flex-row items-center">
          <al-language-picker
            class="mr-3 hidden md:block"
            [language]="language()"
            (languageChange)="languageChange.emit($event)"
          />

          <button
            data-testid="header-theme-switch"
            class="flex items-center bg-transparent p-1"
            [attr.aria-label]="t('toggle_theme')"
            (click)="themeToggle.emit()"
          >
            <fast-svg
              class="text-al-pink"
              [name]="themeSwitchIcon()"
              size="24"
            />
          </button>

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
    FastSvgComponent,
    TranslocoDirective,
  ],
})
export class HeaderComponent {
  readonly navItems = headerNavItems;

  readonly language = input.required<string>();
  readonly theme = input.required<'light' | 'dark'>();

  protected languageChange = output<string>();

  protected themeToggle = output<void>();

  protected showNav = signal<boolean>(false);

  protected readonly themeSwitchIcon = computed(() =>
    this.theme() === 'light' ? 'moon' : 'sun',
  );

  protected toggleNav(): void {
    this.showNav.set(!this.showNav());
  }
}
