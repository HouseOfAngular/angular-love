import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';

@Component({
  selector: 'al-become-author-advertisement',
  templateUrl: './become-author-advertisement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GradientCardDirective, CardComponent, TranslocoDirective],
  host: {
    'data-testid': 'become-author-advertisement',
  },
})
export class BecomeAuthorAdvertisementComponent {}
