import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';

import { HeaderPartnerLogoComponent } from './header-partner-logo.component';

@Component({
  standalone: true,
  selector: 'al-header-logo',
  template: `
    <div class="flex gap-4">
      <a
        data-testid="header-home"
        class="flex items-center gap-2"
        [routerLink]="'/' | alLocalize"
      >
        <img
          alt="Angular Love logo"
          class="inline-block"
          height="40"
          width="36"
          priority="1"
          ngSrc="assets/angular-love-logo.webp"
        />
      </a>

      <al-header-partner-logo-component />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlLocalizePipe,
    NgOptimizedImage,
    RouterLink,
    HeaderPartnerLogoComponent,
  ],
})
export class HeaderLogoComponent {}
