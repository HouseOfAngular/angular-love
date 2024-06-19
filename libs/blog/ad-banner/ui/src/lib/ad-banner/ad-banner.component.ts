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
  // TODO: Uncomment once https://github.com/angular-eslint/angular-eslint/pull/1772 is resolved
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'block w-full bg-al-card',
  },
})
export class AdBannerComponent {
  data = input.required<AdBanner>();
  closed = output<void>();
}
