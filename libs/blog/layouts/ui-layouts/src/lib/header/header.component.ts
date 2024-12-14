import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';
import { NavigationComponent } from '@angular-love/blog/layouts/ui-navigation';

@Component({
  selector: 'al-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    RouterLink,
    NavigationComponent,
    NgClass,
    TranslocoDirective,
    AlLocalizePipe,
    FastSvgComponent,
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
