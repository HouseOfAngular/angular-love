import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';

@Component({
  selector: 'al-become-author-advertisement',
  templateUrl: './become-author-advertisement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GradientCardDirective, CardComponent],
  host: {
    'data-testid': 'become-author-advertisement',
  },
})
export class BecomeAuthorAdvertisementComponent {
  ariaLabel = input<string>();
}
