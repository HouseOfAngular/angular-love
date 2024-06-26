import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { IconComponent } from '@angular-love/blog/shared/ui-icon';

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
  imports: [IconComponent, TranslocoDirective],
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
