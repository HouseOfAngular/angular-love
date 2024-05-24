import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'al-footer-logo',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div class="flex flex-col justify-start">
      <div>
        <img
          alt="Angular Love logo"
          class="inline-block"
          ngSrc="assets/angular-love-logo.png"
          height="40"
          width="36"
        />
        <span class="px-4 text-lg font-bold">angular.love</span>
      </div>
      <span class="text-al-gray-50 hidden pt-1 text-xs lg:block">
        Copyright &#169; {{ currentYear() }}
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterLogoComponent {
  currentYear = input.required<number>();
}
