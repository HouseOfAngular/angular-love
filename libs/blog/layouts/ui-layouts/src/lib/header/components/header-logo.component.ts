import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';

@Component({
  standalone: true,
  selector: 'al-header-logo',
  template: `
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
      <h1 class="text-al-primary px-4 text-lg font-bold">angular.love</h1>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlLocalizePipe, NgOptimizedImage, RouterLink],
})
export class HeaderLogoComponent {}
