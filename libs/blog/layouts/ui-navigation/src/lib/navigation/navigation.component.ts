import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';

export type NavItem = {
  translationPath: string;
  link: string[];
  dataTestId: string;
  externalLink?: boolean;
  showElement?: boolean;
};

@Component({
  selector: 'al-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, TranslocoDirective, AlLocalizePipe],
})
export class NavigationComponent {
  readonly navItems = input.required<NavItem[]>();
  readonly whiteFont = input<boolean>(false);
  readonly cols = input<number>();
  readonly rows = input<number>();

  protected readonly gridClasses = computed(() => {
    if (!this.cols() && !this.rows()) {
      return 'flex flex-wrap justify-center';
    }

    const classes: string[] = ['grid'];

    if (this.cols()) {
      classes.push(`grid-cols-${this.cols()}`);
    }

    if (this.rows()) {
      classes.push(`grid-rows-${this.rows()}`);
    }

    return classes.join(' ');
  });

  protected navigated = output();
}
