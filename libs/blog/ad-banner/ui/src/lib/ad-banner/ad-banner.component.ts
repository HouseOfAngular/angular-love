import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { IconComponent } from '@angular-love/blog/shared/ui-icon';

export type AdBanner = {
  title: string;
  number: number;
  description: string;
  date: string;
  time: string;
  location: string;
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
