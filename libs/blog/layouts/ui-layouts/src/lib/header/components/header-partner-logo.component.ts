import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

@Component({
  standalone: true,
  selector: 'al-header-partner-logo-component',
  template: `
    <div class="flex flex-col">
      <h1 class="text-al-primary text-md font-bold">angular.love</h1>

      <div class="left flex items-center justify-center">
        <div class="mr-1 flex flex-col items-end text-[8px]">
          <span>Powered</span>
          <span>by</span>
        </div>

        <a
          href="https://houseofangular.io/"
          title="House of Angular Logo - Hire us for your project!"
        >
          <fast-svg name="hoa-logo" class="text-white" height="30" width="60" />
        </a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FastSvgComponent],
})
export class HeaderPartnerLogoComponent {}
