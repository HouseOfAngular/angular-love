import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { FastSvgComponent } from '@push-based/ngx-fast-svg';

export type AdBanner = {
  title: string;
  title_mobile: string;
  description: string;
  description_mobile: string;
  additional_info: string;
  href: string;
};

@Component({
  selector: 'al-ad-banner',
  standalone: true,
  imports: [TranslocoDirective, FastSvgComponent],
  templateUrl: './ad-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full bg-al-card',
  },
})
export class AdBannerComponent {
  data = input.required<AdBanner>();
  closed = output<void>();
}
