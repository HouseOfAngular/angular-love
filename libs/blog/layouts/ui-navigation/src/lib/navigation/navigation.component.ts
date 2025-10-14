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
  readonly layout = input<'vertical' | 'horizontal'>('horizontal');

  protected readonly listClasses = computed(() => {
    if (this.layout() === 'vertical') {
      return 'flex flex-col justify-between';
    }

    if (!this.cols()) {
      return 'flex flex-wrap justify-center';
    }

    return `grid gap-2 grid-cols-${this.cols()}`;
  });

  protected navigated = output();
}
