import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'al-footer-logo',
  imports: [NgOptimizedImage],
  template: `
    <div class="flex flex-col justify-start">
      <div>
        <img
          alt="Angular Love logo"
          class="inline-block"
          ngSrc="assets/angular-love-logo.webp"
          height="40"
          width="36"
        />
        <span class="text-al-primary px-4 text-lg font-bold">angular.love</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterLogoComponent {}
