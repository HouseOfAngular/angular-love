import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';

@Component({
  selector: 'al-header-logo',
  template: `
    <a
      *transloco="let t; read: 'nav'"
      data-testid="header-home"
      class="flex items-center gap-2"
      [attr.aria-label]="t('home')"
      [routerLink]="'/' | alLocalize"
    >
      <img
        alt=""
        class="inline-block"
        height="40"
        width="36"
        priority="1"
        ngSrc="assets/angular-love-logo.webp"
      />
      <div class="text-al-primary px-4 text-lg font-bold">angular.love</div>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlLocalizePipe, NgOptimizedImage, RouterLink, TranslocoDirective],
})
export class HeaderLogoComponent {}
