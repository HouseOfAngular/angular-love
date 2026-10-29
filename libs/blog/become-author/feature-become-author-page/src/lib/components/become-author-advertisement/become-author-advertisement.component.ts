import { Component, input } from '@angular/core';

import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';

@Component({
  selector: 'al-become-author-advertisement',
  templateUrl: './become-author-advertisement.component.html',
  imports: [GradientCardDirective, CardComponent],
  host: {
    'data-testid': 'become-author-advertisement',
  },
})
export class BecomeAuthorAdvertisementComponent {
  ariaLabel = input<string>();
}
