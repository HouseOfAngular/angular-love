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
          ngSrc="assets/angular-love-logo.webp"
          height="40"
          width="36"
        />
        <span class="text-al-primary px-4 text-lg font-bold">angular.love</span>
      </div>
      <small class="text-al-muted hidden pt-1 text-xs lg:block">
        Copyright &#169; {{ currentYear() }}
      </small>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterLogoComponent {
  readonly currentYear = input.required<number>();
}
