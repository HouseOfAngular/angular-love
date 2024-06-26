import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';

@Component({
  selector: 'al-become-author-advertisement',
  standalone: true,
  templateUrl: './become-author-advertisement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GradientCardDirective, CardComponent, TranslocoDirective],
  host: {
    'data-testid': 'become-author-advertisement',
  },
})
export class BecomeAuthorAdvertisementComponent {}
